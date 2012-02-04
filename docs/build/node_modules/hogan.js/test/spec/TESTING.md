Testing your Mustache implementation against this specification should be
relatively simple.  If you have a readily available testing framework on your
platform, your task may be even simpler.

In general, the process for each `.yml` file is as follows:

1. Use a YAML parser to load the file.

2. For each test in the 'tests' array:

  1. Ensure that each element of the 'partials' hash (if it exists) is
     stored in a place where the interpreter will look for it.

  2. If your implementation will not support lambdas, feel free to skip over
     the optional '~lambdas.yml' file.

  2.1. If your implementation will support lambdas, ensure that each member of
       'data' tagged with '!code' is properly processed into a language-
       specific lambda reference.

      *   e.g. Given this YAML data hash:

          `{ x: !code { ruby: 'proc { "x" }', perl: 'sub { "x" }' } }`

          a Ruby-based Mustache implementation would process it such that it
          was equivalent to this Ruby hash:

          `{ 'x' => proc { "x" } }`

      *   If your implementation language does not currently have lambda
          examples in the spec, feel free to implement them and send a pull
          request.

      *   The JSON version of the spec represents these tagged values as a hash
          with a '`__tag__`' key of 'code'.

  3. Render the template (stored in the 'template' key) with the given 'data'
     hash.

  4. Compare the results of your rendering against the 'expected' value; any
     differences should be reported, along with any useful debugging
     information.

     *  Of note, the 'desc' key contains a rough one-line description of the
        behavior being tested -- this is most useful in conjunction with the
        file name and test 'name'.
