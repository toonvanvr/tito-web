// This is example code to show how we would use the library in practice
// Using 'any' types just to remove the squiggly lines
// The library is not implemented yet, so  --- this is a design/example file ---

import { BehaviorSubject, Subject } from "rxjs"

// Symbols
/** For accessing builtins */
const tito = Symbol('tito')
/** For binding reactive values to the HTMLElement attributes */
const attr = Symbol('attr')
/** Your application theme */
const theme = Symbol('theme')
/** Form validation helpers */
const validate = Symbol('validate')

/** 
 * The HTML element factory is a Proxy.
 * 
 * It will generate Proxy wrappers around HTML elements with a reference to the factory configuration
 * => Let's call the generated proxies a 'tito'
 *  
 * These tito's
 * - are callable => append childs
 * - have symbol attributes to enter the plugin scope, for example: myInput[validate].minLength(3)
 *                                                                         ^ enter the scope  
 *                                                                                   ^ call a method from the 'validate' scope
 * - the scopes are the third layer of proxies
 * - further proxies are allowed, but since we're in the plugin scope, we don't care.
 *   => plugins can do anything, it will be the strength (and possibly downfall) of this library
 * 
 * That's the whole concept of the library: factories with fully typed plugins which provide all web app functionality.
 * 
 * An example of a plugin could be your application theme, here provided as 'theme'.
 * The plugin provides `errorText`, which is equivalent to a css class `.error-text`, but fully implemented in TS.
 * In this case, it would provide small red text
 * 
 * Another example would be the [validate] plugin. It can read the value from `<input>` elements and stores some of its configuration
 * in the element's local "tito state". In the example below, you see `[validate].forInput(passwordInput)`, which gets a reference to
 * our HTMLElement to which that state is attached.
 * 
 * Note: This is not an ideal example: you need to ensure that the referenced element is a "tito". It makes using the library more complicated
 * for new users because they need to know this kind of magic happens behind the scenes. => to be reconsidered
 * 
 * ~ The magic being these two elements referencing eachother:
 *   > const myInput = input[validate].minLength(3)
 *   > const myError = inputError[validate].fromInput(myInput)
 *   It's pretty straightforward in this case, but we want to avoid it.
 * 
 * 
 */
const html: any = {}

// COMPONENT

export function createLoginForm() {
  // The text values of the form are Observables
  // Since this is probably the only dependency of the library, we might implement our own implementation at some point
  const username = new Subject()
  const password = new Subject()

  // .value() would be a special case, because we have "oninput" events changing the value outside of our knowledge. The library will add an event listener during the lifecycle of the component to automatically update the reactive value
  const usernameInput = html.input
    [attr].value(username)
    [validate].minLength(3).maxLength(24)

  const passwordInput = html.input
    [attr].value(password) 
    [validate].password({ symbol: true, number: true}).minLength(12)

  return html.form( // <-- this is an example of being "callable" -- to make a proxy callable, you MUST provide a function as target, no matter typing; it's a JS thing
    usernameInput,
    html.span
      [theme].errorText // "shorthand" functions. Implemented like getters, they do execute an action, but require no arguments
      [validate].forInput(usernameInput),
    passwordInput,
    html.span
      [theme].errorText
      [validate].forInput(passwordInput)
  )
}

const form: HTMLFormElement = createLoginForm()
document.body.appendChild(form)