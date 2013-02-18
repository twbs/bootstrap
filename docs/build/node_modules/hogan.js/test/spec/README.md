The repository at https://github.com/mustache/spec is the formal standard for
Mustache.  It defines both normal usage and edge-case behavior for libraries
parsing the Mustache templating language (or a superset thereof).

The specification is developed as a series of YAML files, under the `specs`
directory.

Versioning
----------
This specification is being [semantically versioned](http://semver.org).
Roughly described, major version changes will always represent backwards
incompatible changes, minor version changes will always represent new language
features and will be backwards compatible, and patch ('tiny') version changes
will always be bug fixes.  For the purposes of semantic versioning, the public
API is the contents of the `specs` directory and the algorithm for testing
against it.

Mustache implementations SHOULD report the most recent version of the spec
(major and minor version numbers).  If an implementation has support for any
optional modules, they SHOULD indicate so with a remark attached to the
version number (e.g. "vX.Y, including lambdas" or "v.X.Y+λ").  It is
RECOMMENDED that implementations not supporting at least v1.0.0 of this spec
refer to themselves as "Mustache-like", or "Mustache-inspired".

Alternate Formats
-----------------

Since YAML is a reasonably complex format that not every language has good
tools for working with, we also provide JSON versions of the specs on a
best-effort basis.

These should be identical to the YAML specifications, but if you find the need
to regenerate them, they can be trivially rebuilt by invoking `rake build`.

It is also worth noting that some specifications (notably, the lambda module)
rely on YAML "tags" to denote special types of data (e.g. source code).  Since
JSON offers no way to denote this, a special key ("`__tag__`") is injected
with the name of the tag as its value.  See `TESTING.md` for more information
about handling tagged data.

Optional Modules
----------------

Specification files beginning with a tilde (`~`) describe optional modules.
At present, the only module being described as optional is regarding support
for lambdas.  As a guideline, a module may be a candidate for optionality
when:

  * It does not affect the core syntax of the language.
  * It does not significantly affect the output of rendered templates.
  * It concerns implementation language features or data types that are not
    common to or core in every targeted language.
  * The lack of support by an implementation does not diminish the usage of
    Mustache in the target language.

As an example, the lambda module is primarily concerned with the handling of a
particular data type (code).  This is a type of data that may be difficult to
support in some languages, and users of those languages will not see the lack
as an 'inconsistency' between implementations.

Support for specific pragmas or syntax extensions, however, are best managed
outside this core specification, as adjunct specifications.

Implementors are strongly encouraged to support any and all modules they are
reasonably capable of supporting.
