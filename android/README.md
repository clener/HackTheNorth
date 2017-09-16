# Android UI Data Feed

Everything is in `JSON`.
Every `JSONObject` will have a `type` key. It will also contain `x`, `y`, `height` and `width`.

For `type` - `group`, there will be an `children` array, which will contain the rest of the UI. 
Example:
```json
{
  "type": "group",
  "children": [{
    "type": "text",
    "text": "something"
  }]
}
```

`type: "list"` is the exact same except it should have a motion tracking thing on it. 

The other type of cells are `button`, `input`, `text` and `unknown`. 

`button`
- `text` - text to display on the button. 
- `textSize` - text size on the button.
- `textColor` - text color of the button text.
- `backgroundColor` - if present, represents the background color of the button. If not forget it. 

`input`
- `text` - text to display inside the input. 
- `hint` - the input hint.
- `textSize` - text size on the button.
- `textColor` - text color of the button text.
- `backgroundColor` - if present, represents the background color of the button. If not forget it. 

`text`
- `text` - text to display inside the input.
- `textSize` - text size on the button.
- `textColor` - text color of the button text.
- `backgroundColor` - if present, represents the background color of the button. If not forget it. 

`unknown`
- it's unknown. make it funny. put a ? in there. who really cares. i hope this doesn't happen.
