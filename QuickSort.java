import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Random;
 
public class QuickSort { 
    static int partition(int[] array, int low, int high) {
        int j, temp, i = low + 1;
        Random random = new Random();
        int x = random.nextInt(high - low) + low;
        temp = array[low];
        array[low] = array[x];
        array[x] = temp;
        for (j = low + 1; j <= high; j++) {
            if (array[j] <= array[low] && j != i) {
                temp = array[j];
                array[j] = array[i];
                array[i++] = temp;
            } else if (array[j] <= array[low]) {
                i++;
            }
        }
        temp = array[i - 1];
        array[i - 1] = array[low];
        array[low] = temp;
        return i - 1;
    }
    static void quickSort(int[] array,int low,int high){
        if(low<high){
            int mid = partition(array,low,high);
            quickSort(array,low,mid-1);
            quickSort(array,mid+1,high);
        }
    }
    public static void main(String[] args) {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int size;
        System.out.println("Enter the size of the array");
        try {
            size = Integer.parseInt(br.readLine());
        } catch (Exception e) {
            System.out.println("Invalid Input");
            return;
        }
        int[] array = new int[size];
        System.out.println("Enter array elements");
        int i;
        for (i = 0; i < array.length; i++) {
            try {
                array[i] = Integer.parseInt(br.readLine());
            } catch (Exception e) {
                System.out.println("An error Occurred");
            }
        }
        System.out.println("The initial array is");
        System.out.println(Arrays.toString(array));
        quickSort(array,0,array.length-1);
        System.out.println("The sorted array is");
        System.out.println(Arrays.toString(array));
    }
}
