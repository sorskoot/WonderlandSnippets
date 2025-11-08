# Wonderland code snippets

This extension provides code snippets for [Wonderland Engine](https://wonderlandengine.com/).

## Features

All Wonderland snippets start `wl:`.

Currently available snippets:

| prefix | functionalty | JS/TS |
| --- | --- | --- |
| `wl:component` | scaffolds the basic component | JS+TS |
| `wl:singleton-component` | scaffolds the basic component with singleton | TS |
| `wl:class-component` | scaffolds the basic class-based component | JS |
| `wl:component:get` | gets a component from an object, stored into local variable | JS |
| `wl:component:get-member` | gets a component from an object, stored as member | JS |
| `wl:component:add` | adds a component to an object, stored into local variable | JS |
| `wl:component:add-member` | adds a component to an object, stored as member | JS |
| `wl:param:enum` | create component parameter of type enum | JS+TS |
| `wl:param:from-enum` | create component parameter of type enum, using an exising enum type | TS |
| `wl:param:float` | create component parameter of type float | JS+TS |
| `wl:param:object` | create component parameter of type object | JS+TS |
| `wl:param:bool` | create component parameter of type bool | JS+TS |
| `wl:param:material` | create component parameter of type material | JS+TS |
| `wl:param:mesh` | create component parameter of type mesh | JS+TS |
| `wl:param:texture` | create component parameter of type texture | JS+TS |
| `wl:param:animation` | create component parameter of type animation | JS+TS |
| `wl:param:skin` | create component parameter of type skin | JS+TS |
| `wl:param:int` | create component parameter of type int | JS+TS |
| `wl:param:string` | create component parameter of type string | JS+TS |
| `wl:param:vec2` | create component parameter of type vector2 | TS |
| `wl:param:vec3` | create component parameter of type vector3 | TS |
| `wl:param:vec4` | create component parameter of type vector4 | TS |
| `wl:onregister` | adds the static onRegister | TS |
| `wl:script-reference` | adds a reference to the deploy folder with the wonderland script for IntelliSense | JS |
| `wl:add-object` | adds an object into the scene | JS |
| `wl:add-objects` | batch adds objects into the scene and starts a loop to add components for each | JS |
| `wl:throw-missing-prop` | Check for missing property and throws error if missing | TS |
| `wl:throw-missing-component` | Check for missing component and throws error if missing | TS |

The snippets contain a few other snippets for typescript. These start with `sorskoot:`.

- `sorskoot:addGetter` | Add public setter to a exising private field
- `sorskoot:singleton` | Add simple singleton setup to a class
- `sorskoot:singletonComponent` | Add singleton setup to component

## Extensions

Right click on a Wonderland Engine project file in VSCode to start a new WL editor instance and open that project, or build the project windowless.

By default it looks for the WonderlandEditor.exe file in the default Windows installation folder. This can be changed through the settings. The setting for this is `WonderlandSnippets.execPath`.

## Known Issues

Nothing known yet.

## Release Notes

### 1.2.2

- Add static onRegister

### 1.2.1

- Fixed a bug in the vector snippet

### 1.2.0

- Add `Open in Wonderland Editor` to the context menu in the VSCode explorer to open .wlp files directly in the Editor.
- Add `Build in Wonderland Editor` to the context menu in the VSCode explorer to build .wlp files from the commandline without opening the editor.
- Add Wonderland Engine icon to .wlp files

### 1.1.6 / 1.1.7 / 1.1.8

- add support for TypeScript-React
- add transfrom snippet for adding getter to private property
- add singleton snippets

### 1.1.5

- fixed issue with color properties.

### 1.1.4

- fixed issue with new vector properties.

### 1.1.3

- Add the vector types for properties (vector2, vector3 and vector4)
- Add Singleton component in typescript
- Add enum property based on enum type in typescript

### 1.1.2

- Update TypeScript Snippets with:
  - Added `{require:true}` to decorator of Object3D since these are often required
  - Added snippet for checking if component exist
  - Added snippet for checking if property is set

### 1.1.1

- Fix Readme.md

### 1.1.0

- Added TypeScript Snippets

### 0.8.3

- Moved registering of component to its own snippet
- Classname transforms to PascalCase from filename

### 0.8.2

- Added the class based component

### 0.8.0

- Initial release of the snippets.
