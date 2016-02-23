# gastropod-task-sass
gastropod addon

## Usage

in your environment config  :

```coffee
# config/development.coffee

module.exports = 

#...

    pipeline:
        styles: ['scss', 'also', 'any-other', 'valid-gulp', 'task']

#...

    plugins:
        css:
            scss: {
                # insert valid node-scss configuration here
                # see: https://github.com/sass/node-sass#options
            }
```

```bash
$ gastropod run default --config=config/development
```
