# Android UI Data Feed

Everything is in `JSON`.
Every `JSONObject` will have a `type` key. It will also contain `x`, `y`, `height` and `width`.

For `type` - `group`, there will be an `elements` array, which will contain the rest of the UI. 
Example:
```json
{
  "type": "group",
  "elements": [{
    "type": "text",
    "text": "something"
  }]
}
```

The other type of cells are `button`, `input`, `text` and `unknown`. 

`button`
- `text` - text to display on the button. 

`input`
- `text` - text to display inside the input. 
- `hint` - the input hint.

`text`
- `text` - text to display inside the input.

`unknown`
- it's unknown. make it funny. put a ? in there. who really cares. i hope this doesn't happen.
