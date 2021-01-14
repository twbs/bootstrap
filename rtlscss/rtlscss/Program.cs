using System;

namespace rtlscss
{
    class Program
    {
        static void Main(string[] args)
        {
            if (System.IO.File.Exists(args[0]) && System.IO.File.Exists(args[1]) && args.Length==4)
                (new Convert()).StartConvert(args[0], args[1], args[2], args[3]);
            else
            {
                Console.WriteLine("Usage: rtlscss.exe \"ltr.css\" \"rtl.css\" \"helper.css\" \"simple.css\"");
            }

        }
    }
}
