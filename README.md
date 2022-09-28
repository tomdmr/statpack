# Statpack-Projekt 

A collection of simple files to quickly produce meaningful charts for
Statistical Process Controll (SPC). It relies mostly on the great
[Plotly graphics library](https://plotly.com/javascript/) to present the results.

The additional statistics in some files is mostly knowledge I gathered
and used in praxis from a Six-Sigma Black Belt course. For the rest, I do not
remember where I snatched it.

The general workflow is to load the file in a browser, and dump data
into a textfield. The format can be quite free. If a file requires
keyed data, like the multi-box-plot, the first element must be the
key. The next elements are separated by tabs, or by semicolon. Tabs
are for copy-paste from Excel, semicolons for human input. For one
key, there can be multiple values in one line. If a value is not
present or cannot be parsed, it is ignored.

The exception to this rule is the multi-scatter plot, whis one
requires key, x, y in one line.

# Included Libraries

In order to be able to run this also offline, I have added foreign
libraries into the directory `js`. These are

  * The graphics stuff, [Plotly](https://github.com/plotly/plotly.js/)
  * Data Driven Documents, [D3](https://github.com/d3/d3)
  * Some statistic from [Fast Statistics](https://github.com/bluesmoon/node-faststats)
  * [sprintf](https://github.com/alexei/sprintf.js)
  * Some distributions were taken from [Thomas S. Ferguson](https://www.math.ucla.edu/~tom/distributions/CONTENTS.html)
  
TODO: Check Licenses of libraries
