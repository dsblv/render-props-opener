# render-props-opener

> Basically async/await but for render propsy React components

#### I'll keep it brief

* It's **experimental**
* There are exactly 0 tests (yet)
* Never measured, but it may be kinda slow
* I'm still not content about the name
* It can do this:

```js
import Opener from "render-props-opener";

const LightTheme = React.createContext({
  textColor: "black",
  backgroundColor: "white"
});

const DarkTheme = React.createContext({
  textColor: "white",
  backgroundColor: "black"
});

const Mode = React.createContext("dark");

<Opener>
  {open => {
    const mode = open(<Mode.Consumer />);
    const theme =
      mode === "light"
        ? open(<LightTheme.Consumer />)
        : open(<DarkTheme.Consumer />);

    return (
      <div
        style={{
          backgroundColor: theme.backgroundColor
        }}
      >
        <h1 style={{ color: theme.textColor }}>
          I sneezed on the beat and the beat got sicker
        </h1>
      </div>
    );
  }}
</Opener>;
```
