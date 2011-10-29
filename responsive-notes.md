Files that remain the same:

* responsive-reset.less

Files converted:

* responsive-bootstrap.less
X * responsive-variables.less (removed all non-modified rule sets)
X * responsive-scaffolding.less (removed all non-modified rule sets)
    - TODO in file (near end)
X * responsive-type.less (removed all non-modified rule sets)
X * responsive-forms.less (mostly done, suspect the rest will workout once other files are updated)

Files added to:

X * responsive-mixins.less

Files to convert:


* responsive-tables.less
* responsive-patterns.less
* responsive-mixins.less


PER FILE NOTES

mixins.less
.size() & .square() don't appear to be used anywhere in the project. Why are they around?

Added mixin .large-type()


