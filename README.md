# Wonderland code snippets

This extension provides code snippets for the [Wonderland Engine](https://wonderlandengine.com/). 

## Features

All snippets start `wl:`. 

Currently available snippets:

| prefix | functionalty | JS/TS |
| --- | --- | 
| `wl:component` | scaffolds the basic component | JS+TS | 
| `wl:class-component` | scaffolds the basic class-based component | JS |
| `wl:component:get` | gets a component from an object, stored into local variable | JS |
| `wl:component:get-member` | gets a component from an object, stored as member | JS |
| `wl:component:add` | adds a component to an object, stored into local variable | JS |
| `wl:component:add-member` | adds a component to an object, stored as member | JS |
| `wl:param:enum` | create component parameter of type enum | JS+TS | 
| `wl:param:float` | create component parameter of type float | JS+TS | 
| `wl:param:object` | create component parameter of type object | JS+TS | 
| `wl:param:bool` | create component parameter of type bool | JS+TS | 
| `wl:param:material` | create component parameter of type material | JS+TS | 
| `wl:param:mesh` | create component parameter of type mesh | JS+TS | 
| `wl:param:texture` | create component parameter of type texture | JS+TS | 
| `wl:param:animation` | create component parameter of type animation  JS+TS | 
| `wl:param:skin` | create component parameter of type skin |
| `wl:param:int` | create component parameter of type int | JS+TS | 
| `wl:param:string` | create component parameter of type string | JS+TS | 
| `wl:script-reference` | adds a reference to the deploy folder with the wonderland script for IntelliSense | JS |
| `wl:add-object` | adds an object into the scene | JS |
| `wl:add-objects` | batch adds objects into the scene and starts a loop to add components for each | JS |

## Known Issues

Nothing known yet. 

## Release Notes

### 0.9.0

- Added TypeScript Snippets

### 0.8.3

- Moved registering of component to its own snippet
- Classname transforms to PascalCase from filename

### 0.8.2

- Added the class based component 

### 0.8.0

- Initial release of the snippets.
