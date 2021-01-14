using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace rtlscss
{
    public class Convert
    {
        public void StartConvert(string SourcePath, string RTLPath, string HelperPath, string OutputPath)
        {
            List<Stylesheet> Source;
            List<Stylesheet> RTL;
            
            Source = ReadCSSFile(SourcePath);
            RTL = ReadCSSFile(RTLPath);

            ComparerNode(Source, RTL);

            StringBuilder sb = new StringBuilder();
            WriteNode(sb, RTL, ".rtl", 1);
            sb.Append(File.ReadAllText(HelperPath));

            string s = sb.ToString();
            File.WriteAllText(OutputPath, s);
            s = new Regex("(/\\*(.|[\r\n])*?\\*/)").Replace(s, "").Replace("\r", "").Replace("\n", "");
            while (s.Contains("  "))
                s = s.Replace("  ", " ");
            s = s.Replace("{ ", "{");
            File.WriteAllText(OutputPath.Substring(0, OutputPath.Length - 3) + "min.css", s);
        }

        private void WriteNode(StringBuilder sb, List<Stylesheet> Target, string TagPrefix, int Indent)
        {
            TagPrefix = TagPrefix.Trim() + " ";
            for (int i = 0; i < Target.Count; i++)
            {
                if (Target[i].Rule == null)
                {
                    for (int j = 0; j < Target[i].Name.Count - 1; j++)
                    {
                        sb.AppendLine(new String(' ', 4 * (Indent - 1)) + TagPrefix + Target[i].Name[j] + ",");
                    }
                    sb.AppendLine(new String(' ', 4 * (Indent - 1)) + TagPrefix + Target[i].Name[Target[i].Name.Count - 1] + " {");
                    for (int j = 0; j < Target[i].Attribute.Count; j++)
                        sb.AppendLine(new String(' ', 4 * Indent) + Target[i].Attribute[j] + ";");
                    sb.AppendLine(new String(' ', 4 * (Indent - 1)) + "}");
                    sb.AppendLine("");
                }
                else
                {
                    if (Target[i].Node.Count > 0)
                    {
                        sb.AppendLine($"{Target[i].Name[0]} {{");
                        WriteNode(sb, Target[i].Node, TagPrefix, Indent + 1);
                        sb.AppendLine("}");
                        sb.AppendLine("");
                    }
                    else
                        sb.AppendLine($"{Target[i].Name[0]};");
                }
            }
        }

        private void ComparerNode(List<Stylesheet> Source, List<Stylesheet> Target)
        {
            for (int i = 0; i < Target.Count; i++)
            {
                List<Stylesheet> t = Source;
                for (int j = 0; j < Target[i].Name.Count; j++)
                    t = t.Where(x => x.Name.Count == Target[i].Name.Count && x.Name.Contains(Target[i].Name[j])).ToList();

                if (t.Count == 0)
                {

                }
                else if (Target[i].Node.Count() > 0)
                {
                    for (int k = 0; k < t.Count; k++)
                        ComparerNode(t[k].Node, Target[i].Node);
                }
                else if (Target[i].Rule == null && Target[i].Attribute.Count > 0)
                {
                    for (int j = 0; j < Target[i].Attribute.Count; j++)
                    {
                        if (t[0].Attribute.Contains(Target[i].Attribute[j]))
                            Target[i].Attribute[j] = "";
                    }
                    Target[i].Attribute.RemoveAll(x => string.IsNullOrEmpty(x));
                }
            }
            //CleanUp
            var tc = Target.Where(x => x.Attribute.Count == 0 && x.Rule == null).ToList();
            for (int i = 0; i < tc.Count; i++)
                Target.Remove(tc[i]);
            tc = Target.Where(x => x.Node.Count == 0 && x.Rule != null && x.Rule != "media").ToList();
            for (int i = 0; i < tc.Count; i++)
                Target.Remove(tc[i]);
        }
       

        private List<Stylesheet> ReadCSSFile(string file)
        {
            List<Stylesheet> ret = new List<Stylesheet>();
            string content = File.ReadAllText(file);

            content = new Regex("(/\\*(.|[\r\n])*?\\*/)").Replace(content, "").Replace("\r", "").Replace("\n", "");
            var parts = content.Split("}");
            var Parent = ret;
            foreach (var part in parts)
            {
                List<string> p = part.Trim().Split("{").ToList();
                if (p.Count > 1)
                {
                    if (p[0].Contains(";"))
                    {
                        var s = p[0].Split(";");
                        for (int i = 0; i < s.Length - 1; i++)
                            Parent.Add(new Stylesheet() { Name = new List<string>() { p[0].Trim() }, Rule = "unknown" });
                        p[0] = s[s.Length - 1];
                    }
                    else if (p[0].ToLower().StartsWith("@media"))
                    {
                        var t = new Stylesheet() { Name = new List<string>() { p[0].Trim() }, Rule = "@media" };
                        Parent.Add(t);
                        Parent = t.Node;
                        p.RemoveAt(0);
                    }

                    Parent.Add(new Stylesheet() { Name = SplitName(p[0]), Attribute = SplitAttr(p[1]) });
                }
                else if (p.Count == 1 && string.IsNullOrEmpty(p[0]))
                    Parent = ret;

            }
            return ret;


        }

        private List<string> SplitName(string v)
        {
            v = v.Trim().Trim(',');
            var p = v.Split(',').ToList();
            for (int i = 0; i < p.Count; i++)
                p[i] = p[i].Trim();
            return p;
        }

        private List<string> SplitAttr(string v)
        {
            var p = v.Trim().Trim(';').Trim().Split(";").ToList();
            for (int i = 0; i < p.Count; i++)
                p[i] = p[i].Trim();
            p.Sort();
            return p;
        }
    }
}
