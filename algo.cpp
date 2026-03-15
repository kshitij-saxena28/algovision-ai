#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int> a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            cout << "compare " << j << " " << j+1 << endl;
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                cout << "swap " << j << " " << j+1 << endl;
            }
        }
    }
}

void insertionSort(vector<int> a) {
    int n = a.size();
    for (int i = 1; i < n; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            cout << "compare " << j << " " << j+1 << endl;
            a[j + 1] = a[j];
            cout << "swap " << j << " " << j+1 << endl;
            j--;
        }
        a[j + 1] = key;
    }
}

int main() {
    vector<int> arr = {30, 10, 50, 20, 40};
    bubbleSort(arr);
    return 0;
}