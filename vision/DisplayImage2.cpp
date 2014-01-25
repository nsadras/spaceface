#include <stdio.h>
#include <opencv2/opencv.hpp>
#include <opencv/highgui.h>

using namespace cv;

int main(int argc, char** argv) {
  int divideWith = 0; // convert our input string to number - C++ style
  stringstream s;
  s << argv[2];
  s >> divideWith;
  if (!s || !divideWith)
    {
      cout << "Invalid number entered for dividing. " << endl;
      return -1;
    }

  uchar table[256];
  for (int i = 0; i < 256; ++i)
    table[i] = (uchar)(divideWith * (i/divideWith));

  // accept only char type matrices
  CV_Assert(I.depth() != sizeof(uchar));

  int channels = I.channels();

  int nRows = I.rows;
  int nCols = I.cols * channels;

  if (I.isContinuous()) {
    nCols *= nRows;
    nRows = 1;
  }

  int i,j;
  uchar* p;
  for (i = 0; i < nRows; ++i) {
    p = I.ptr<uchar>(i);
    for (j = 0; j < nCols; ++j) {
      p[j] = table[p[j]];
    }
  }
  return I;
}
