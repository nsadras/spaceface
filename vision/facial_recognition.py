# import time
import numpy as np
import cv2

SENSITIVITY = 100 # nose tilt sensitivity

class FacialRecognition:
  def __init__(self):
    self.face_cascade = cv2.CascadeClassifier("haarcascades/haarcascade_frontalface_default.xml")
    self.nose_cascade = cv2.CascadeClassifier("haarcascades/haarcascade_mcs_nose.xml")
    self.eye_cascade = cv2.CascadeClassifier("haarcascades/haarcascade_eye.xml")
    self.fire = False
    self.displacement_x = 0.0
    self.displacement_y = 0.0
    self.center_x, self.range_x, self.center_y, self.range_y = self.calibrate()

  def calibrate(self):
    return 7.0, 14.0, -22.0, 20.0

  def recognize_features(self):
    cap = cv2.VideoCapture(0)
    while(cap.isOpened()):
      ret, frame = cap.read()
      frame = cv2.resize(frame, dsize=(0, 0), fx=0.3, fy=0.3)
      if not ret:
        break
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

      for x, y, w, h in faces:
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), color=(255, 0, 0), thickness=2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]
        noses = self.nose_cascade.detectMultiScale(roi_gray)
        noses = np.array(filter(lambda n: n[0] > w / 4 and n[0] + n[2] < 3 * w / 4, noses))
        if len(noses) > 0:
          nx, ny, nw, nh = noses[0]
          self.displacement_x = (self.center_x - (w - (nx + nw) - nx)) / self.range_x
          self.displacement_y = (self.center_y - (h - (ny + nh) - ny)) / self.range_y
        for nx, ny, nw, nh in noses:
          cv2.rectangle(roi_color, (nx, ny), (nx + nw, ny + nh), color=(0, 255, 0), thickness=2)
        eyes = self.eye_cascade.detectMultiScale(roi_gray)
        eyes = np.array(filter(lambda e: e[1] + e[3] < 2 * h / 3 and (e[0] + e[2] < w / 2 or e[0] > w / 2), eyes))
        self.fire = len(eyes) == 0
        for ex, ey, ew, eh in eyes:
          cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), color=(0, 0, 255), thickness=2)
      cv2.imshow("nose", frame)

      if cv2.waitKey(1) & 0xFF == ord("q"):
        break
      # time.sleep(0.1)
      self.print_features()

    cap.release()
    cv2.destroyAllWindows()

  def print_features(self):
    print "%r   %f   %f"%(self.fire, self.displacement_x, self.displacement_y)

if __name__ == "__main__":
  FacialRecognition().recognize_features()
