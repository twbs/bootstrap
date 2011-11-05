Files that remain the same:

* responsive-reset.less

Files converted:

* responsive-bootstrap.less
* responsive-variables.less (removed all non-modified rule sets)
* responsive-scaffolding.less (removed all non-modified rule sets)
    - TODO in file (near end)
* responsive-type.less (removed all non-modified rule sets)
* responsive-forms.less (mostly done, suspect the rest will workout once other files are updated)
* responsive-mixins.less (added a mixin)
* responsive-tables.less

Files to convert:

* responsive-patterns.less


PER-FILE NOTES

mixins.less
.size() & .square() don't appear to be used anywhere in the project. Why are they around?

Added mixin .large-type()


