using System;
using System.Collections.Generic;
using System.Text;

namespace rtlscss
{
    class Stylesheet
    {
        public List<string> Name { get; set; } = new List<string>();
        public string Rule { get; set; } = null;
        public List<string> Attribute { get; set; } = new List<string>();
        public List<Stylesheet> Node { get; set; } = new List<Stylesheet>();
    }
}
