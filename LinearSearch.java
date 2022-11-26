import java.util.*;
public class LinearSearch {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter number of elements:");
        int N = sc.nextInt();
        System.out.println("Enter elements:");
        int[] arr = new int[N];
        for(int i=0;i<N;i++){
            arr[i] = sc.nextInt();
        }
        System.out.println("Enter target element:");
        int target = sc.nextInt();
        int index = Search(N, arr, target);
        System.out.println("The array is as follows:\n" + arr.toString());
        
        if(index == -1)
            System.out.println("Sorry, element not found");
        else
            System.out.println("The element is present at index "+index);
    }
    
    public static int Search(int N, int[] arr, int target){
        for(int i=0; i<N; i++){
            if(arr[i] == target) return i+1;
        }
        return -1;
    }
}
