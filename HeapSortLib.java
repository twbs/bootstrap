import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.PriorityQueue;
 
public class HeapSortLib {
    static void libraryHeapSort(int[] array){
        PriorityQueue<Integer> priorityQueue = new PriorityQueue<>();
        int i;
        for(i=0; i<array.length; i++){
            priorityQueue.add(array[i]);
        }
        i=0;
        while(!priorityQueue.isEmpty()){
            array[i++] = priorityQueue.poll();
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
        libraryHeapSort(array);
        System.out.println("The sorted array is");
        System.out.println(Arrays.toString(array));
    }
}
