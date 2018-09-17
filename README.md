# CSCS REPL Extension for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) [extension](https://marketplace.visualstudio.com/VSCode) with rich support for CSCS (Customized Scripting in C#). The CSCS scripting language has been described in [CODE Magazine](http://www.codemag.com/Article/1607081), [MSDN Magazine](https://msdn.microsoft.com/en-us/magazine/mt632273.aspx), and in [this Syncfusion E-book](https://www.syncfusion.com/resources/techportal/details/ebooks/implementing-a-custom-language).

The cool thing about CSCS is that you can modify the mobile app Layout on the fly! And this is using the same code for iOS and for Android devices. Check out the first animated gif below.

The main advantage of the CSCS scripting language is the possibility to easily modify the language functionality or to add new functions. Everything is open sourced (see [Windows/Mac Version](https://github.com/vassilych/cscs) and [Mobile Development Version](https://github.com/vassilych/mobile)) and is absolutely free to use.

You can also use CSCS for cross-platform mobile develpment with Xamarin. See
[CODE Magazine](http://www.codemag.com/article/1711081), [MSDN Magazine](https://msdn.microsoft.com/en-us/magazine/mt829272) and [this Syncfusion E-book](https://www.syncfusion.com/ebooks/writing_native_mobile_apps_in_a_functional_language_succinctly).

This extention contains the CSCS syntax highlighting and supports [REPL](https://en.wikipedia.org/wiki/Read–eval–print_loop) (Read-Eval-Print Loop).

## Extension Features

* Select some text and press Cmd+9 (macOS) or Ctrl+9 (Windows and Linux)
* These key bindings are configurable
* If no code is selected, the whole line will be sent for the evaluation
* You can select multiple lines and whole functions (see the animated gifs)
* The results of running the selected code will be shown in the new Output window "CSCS"
* For debugging CSCS files and more features use [CSCS Debugger](https://marketplace.visualstudio.com/items?itemName=vassilik.cscs-debugger)

## Quick Start

### Windows/Mac/VS Extensions

* **Step 1.** Download the CSCS parser [Windows/Mac Version](https://github.com/vassilych/cscs).

* **Step 2.** Open the project downloaded in the first step Visual Studio Code and compile it.

* **Step 3.** Start the DebugServer either from Visual Studio Code or from the command-line. The default port is 13337. The host and port are configurable.

* **Step 4.** Open any CSCS file in Visual Studio Code and start selecting code fragments and pressing Cmd+9 (Ctrl+9) (see the animated gifs below).

### Mobile Development/Unity Extension

* **Step 1.** Download the CSCS parser [Mobile Development Version](https://github.com/vassilych/mobile).

* **Step 2.** Open the project downloaded in the first step Visual Studio and compile it.

* **Step 3.** Start the DebugServer from Visual Studio with Xamarin. The default port is 13337.

* **Step 4.** Open any CSCS file in Visual Studio Code and start selecting code fragments and pressing Cmd+9 (Ctrl+9) (see the animated gifs below).

## Questions, Issues, and Feature Requests

* If you have a question about how to accomplish something with the extension or come across a problem with the extension, please [ask me](http://www.ilanguage.ch/p/contact.html)

## CSCS REPL in Action

* Here is the REPL with an iOS device. You can see that you can add and remove widgets on the fly.

![General Features](https://raw.githubusercontent.com/vassilych/cscs-repl/master/images/repl_ios_cscs.gif)

* Here is the REPL with a normal CSCS script.

![General Features](https://raw.githubusercontent.com/vassilych/cscs-repl/master/images/repl_cscs.gif)

## Data and Privacy

The CSCS Extension for Visual Studio Code DOES NOT collect any data from the user.
