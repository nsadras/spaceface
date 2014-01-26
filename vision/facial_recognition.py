import time
import sys
import json
import numpy as np
import cv2

NUM_PRINTS = 200 # hack, don't ask

class FacialRecognitionException(Exception):
  pass

class FacialRecognition:
  def __init__(self):
    self.face_cascade = cv2.CascadeClassifier("haarcascades/haarcascade_frontalface_default.xml")
    self.nose_cascade = cv2.CascadeClassifier("haarcascades/haarcascade_mcs_nose.xml")
    self.eye_cascade = cv2.CascadeClassifier("haarcascades/haarcascade_eye.xml")
    self.fire = False
    self.prev_fire = False
    self.displacement_x = 0.0
    self.displacement_y = 0.0
    self.dist = 0.0
    self.center_x, self.min_x, self.max_x, self.center_y, self.min_y, self.max_y, self.init_dist = self.calibrate()

  def calibrate(self):
    sys.stderr.write("Calibration...\n")
    self.cap = cv2.VideoCapture(0)
    try:
      center_x, center_y, init_dist = self.calibrate_center()
      min_x = self.calibrate_edge(motion_str="leftward")[0]
      self.calibrate_center()
      while min_x >= center_x:
        sys.stderr.write("Calibration stage failed, attempting again.\n")
        min_x = self.calibrate_edge(motion_str="leftward")[0]
        self.calibrate_center()
      max_x = self.calibrate_edge(motion_str="rightward")[0]
      self.calibrate_center()
      while max_x <= center_x:
        sys.stderr.write("Calibration stage failed, attempting again.\n")
        max_x = self.calibrate_edge(motion_str="rightward")[0]
        self.calibrate_center()
      min_y = self.calibrate_edge(motion_str="downward")[1]
      self.calibrate_center()
      while min_y >= center_y:
        sys.stderr.write("Calibration stage failed, attempting again.\n")
        min_y = self.calibrate_edge(motion_str="downward")[1]
        self.calibrate_center()
      max_y = self.calibrate_edge(motion_str="upward")[1]
      self.calibrate_center()
      while max_y <= center_y:
        sys.stderr.write("Calibration stage failed, attempting again.\n")
        max_y = self.calibrate_edge(motion_str="upward")[1]
        self.calibrate_center()
    except FacialRecognitionException as e:
      self.cap.release()
      cv2.destroyAllWindows()
      sys.exit(-1)
    # self.cap.release()
    # cv2.destroyAllWindows()
    sys.stderr.write("Calibration complete.\n")
    return center_x, min_x, max_x, center_y, min_y, max_y, init_dist

  def calibrate_center(self):
    sys.stderr.write("Look at camera directly (centered). Press 'c' to continue when face and nose are recognized.\n")
    center_x, center_y = 0, 0
    while (self.cap.isOpened()):
      ret, frame = self.cap.read()
      frame = cv2.resize(frame, dsize=(0, 0), fx=0.3, fy=0.3)
      if not ret:
        sys.stderr.write("Camera error, quitting.\n")
        raise FacialRecognitionException()
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

      for x, y, w, h in faces:
        init_dist = w
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), color=(255, 0, 0), thickness=2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]
        noses = self.nose_cascade.detectMultiScale(roi_gray)
        noses = np.array(filter(lambda n: n[0] > w / 4 and n[0] + n[2] < 3 * w / 4, noses))
        if len(noses) > 0:
          nx, ny, nw, nh = noses[0]
          center_x = (w - (nx + nw) - nx)
          center_y = (h - (ny + nh) - ny)
        for nx, ny, nw, nh in noses:
          cv2.rectangle(roi_color, (nx, ny), (nx + nw, ny + nh), color=(0, 255, 0), thickness=2)
      cv2.imshow("calibration", frame)

      if cv2.waitKey(1) & 0xFF == ord("c"):
        cv2.destroyWindow("calibration")
        return center_x, center_y, init_dist

  def calibrate_edge(self, motion_str):
    sys.stderr.write("Turn head slowly %s.\n"%motion_str)
    edge_x, edge_y = 0, 0
    while (self.cap.isOpened()):
      ret, frame = self.cap.read()
      frame = cv2.resize(frame, dsize=(0, 0), fx=0.3, fy=0.3)
      if not ret:
        sys.stderr.write("Camera error, quitting.\n")
        raise FacialRecognitionException()
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
      if len(faces) == 0:
        cv2.destroyWindow("calibration")
        return (edge_x, edge_y)

      for x, y, w, h in faces:
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), color=(255, 0, 0), thickness=2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]
        noses = self.nose_cascade.detectMultiScale(roi_gray)
        noses = np.array(filter(lambda n: n[0] > w / 4 and n[0] + n[2] < 3 * w / 4, noses))
        if len(noses) > 0:
          nx, ny, nw, nh = noses[0]
          edge_x = (w - (nx + nw) - nx)
          edge_y = (h - (ny + nh) - ny)
        for nx, ny, nw, nh in noses:
          cv2.rectangle(roi_color, (nx, ny), (nx + nw, ny + nh), color=(0, 255, 0), thickness=2)
      cv2.imshow("calibration", frame)
      if cv2.waitKey(1) & 0xFF:
        pass # need this to keep image window open

  def recognize_features(self):
    # self.cap = cv2.VideoCapture(0)
    while self.cap.isOpened():
      ret, frame = self.cap.read()
      frame = cv2.resize(frame, dsize=(0, 0), fx=0.3, fy=0.3)
      if not ret:
        sys.stderr.write("Connection with camera lost, quitting.\n")
        sys.exit(-1)
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

      for x, y, w, h in faces:
        self.dist = self.init_dist - w
        roi_gray = gray[y:y+h, x:x+w]
        noses = self.nose_cascade.detectMultiScale(roi_gray)
        noses = np.array(filter(lambda n: n[0] > w / 4 and n[0] + n[2] < 3 * w / 4, noses))
        if len(noses) > 0:
          nx, ny, nw, nh = noses[0]
          if w - (nx + nw) - nx > self.center_x:
            self.displacement_x = min((float) (w - (nx + nw) - nx - self.center_x) / (self.max_x - self.center_x), 1.0)
          else:
            self.displacement_x = max((float) (w - (nx + nw) - nx - self.center_x) / (self.center_x - self.min_x), -1.0)

          if h - (ny + nh) - ny > self.center_y:
            self.displacement_y = min((float) (h - (ny + nh) - ny - self.center_y) / (self.max_y - self.center_y), 1.0)
          else:
            self.displacement_y = max((float) (h - (ny + nh) - ny - self.center_y) / (self.center_y - self.min_y), -1.0)
        eyes = self.eye_cascade.detectMultiScale(roi_gray)
        eyes = np.array(filter(lambda e: e[1] + e[3] < 2 * h / 3 and (e[0] + e[2] < w / 2 or e[0] > w / 2), eyes))
        if len(eyes) == 0:
          if self.prev_fire:
            self.fire = True
          else:
            self.fire = False
            self.prev_fire = True
        else:
          self.fire = False
          self.prev_fire = False

      if cv2.waitKey(1) & 0xFF == ord("q"):
        sys.stderr.write("Quitting.\n")
        sys.exit(0)
      self.print_features()

    self.cap.release()
    cv2.destroyAllWindows()

  def print_features(self):
    for _ in range(NUM_PRINTS):
      print(json.dumps({"fire":self.fire, "x":self.displacement_x, "y":self.displacement_y, "dist":float(self.dist)}))
    sys.stderr.write("%r   %f   %f   %f\n"%(self.fire, self.displacement_x, self.displacement_y, self.dist))

if __name__ == "__main__":
  f = FacialRecognition()
  f.recognize_features()
