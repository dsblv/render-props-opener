import * as React from "react";
import { isElement } from "react-is";

// It's ironic that the tool for eliminating ~render props~ hell
// is itself a ~render props~ component. In fact, it uses itself
// to achieve its goals!
// The idea is to repeatedly call `props.children()` until their
// need are fulfilled. React's own Suspense kinda does similar
// thing.
// Each failed attempt renders another instance of <Unfold />
// wrapped with required ~render props~ component. Eventually
// we get the same tree we'd write by hand, except we didn't
// have to write it.

// type Props = {
//   children: (open: (React.Element) => mixed) => React.Node,
//   stack: Array<mixed>
// };

function Unfold(props) {
  // Render functions in React are supposed to be pure. This
  // means requirements will always appear in the same order.
  // That's why we keep values in array.
  var depth = 0;

  // `open()` is how you declare your requirements. Every time
  // when unfulfilled requirement is met, `open()` will throw,
  // effectively letting us know we need another round.
  function open(element) {
    if (!isElement(element)) {
      throw new TypeError("open() expects React Element as its first argument");
    }

    // Under the hood `open()` looks up accumulated values by
    // index and throws `element` when values run out.
    if (depth < props.stack.length) {
      var value = props.stack[depth];
      depth++;
      return value;
    } else {
      throw element;
    }
  }

  try {
    return props.children(open);
  } catch (element) {
    if (!isElement(element)) {
      throw element;
    }

    // Later we catch that `element` and render it. We swap
    // its children with a new instance of ourseleves, this
    // time with one more value on our `stack`.

    return React.cloneElement(element, {
      children: function(value) {
        // return <Unfold stack={[...stack, value]}>{children}</Unfold>;
        return React.createElement(Unfold, {
          stack: props.stack.concat(value),
          children: props.children
        });
      }
    });
  }
}

// type Props = {
//   children: (open: (React.Element) => mixed) => React.Node
// };

export default function Opener(props) {
  // return <Unfold stack={[]}>{children}</Unfold>;
  return React.createElement(Unfold, {
    stack: [],
    children: props.children
  });
}
