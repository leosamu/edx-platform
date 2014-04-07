
.. _Custom JavaScript Display and Grading:

##########################################
Custom JavaScript Applications
##########################################


*******************************
Overview
*******************************


You can include in a course custom JavaScript applications (also called custom JavaScript problems or JS
Input problems). You add the application directly into edX Studio.

When you create a JavaScript application, Studio embeds the problem in an inline frame (IFrame)
so that students can interact with it in the LMS. 

See the following sections for more information:

* 



Course staff should see the following sections of the document *Building and Running an edX Course*:

* `Custom JavaScript Display and Grading <http://edx.re
adthedocs.org/projects/ca/en/latest/problems_tools/advanced_problems.html
#custom-javascript-display-and-grading>`_ 

* `Establishing a Grading Policy <http:
//edx.readthedocs.org/projects/ca/en/latest/building_course/establish_grading_po
licy.html>`_ in *Building and Running an edX Course*.

The rest of this section provides more information for developers who are
creating JavaScript applications for courses on the edX platform.

.. note:: This section assumes proficiency with JavaScript and with how problems
 are constructed in edX Studio If you intend to grade students' interactions
 with your JavaScript application, you must also be proficient with Python.



*******************************************************
Grading Options for Custom JavaScript Applications
*******************************************************

When using a JavaScript application in your course content, you have three options:

#. A JavaScript application that visually demonstrates a concept or process. The application would not require student interaction, and students would not be graded.

#. A JavaScript application that requires student interaction but does not grade performance. Referred to as a formative assessment, such an application provides feedback to students based on their interactions. 

#. A JavaScript application that requires and grades student interaction. Referred to as a summative assessment, such an application can be used to evaluate student learning against a standard. To use the JavaScript applicaton as a summative assessment and have student performance integrated into the edX grading system, you must also use basic Python code in the component.

These options are explained through examples below.

*******************************************************
Using a JavaScript Application Without Grading
*******************************************************

The simplest option is to use JavaScript to show content to students, and optionally to provide feedback as a formative assessment. 

#. In edX Studio, upload an HTML file that contains the JavaScript you want to show students.
#. Copy the **Embed URL** of the file. 
#. `Create a Custom JavaScript Display and Grading Problem <>_`.
   The template for the problem contains the definition for a sample JavaScript applicaton that requries and grades student interaction.
#. Edit the XML of the component to remove grading information and refer to the HTML file you uploaded:

.. code-block:: xml

    <customresponse>
        <jsinput
         width="width needed to display your application"
         height="height needed to display your application"
         html_file="Embed URL of the HTML file"
         sop="false"/>
    </customresponse>

For example:

.. code-block:: xml

    <customresponse>
        <jsinput
         width="400"
         height="400"
         html_file="/static/electrol_demo.html"
         sop="false"/>
    </customresponse>


**************************************************************
Using a JavaScript Application for a Summative Assessment
**************************************************************

To use a JavaScript Application for a summative assessment and have student results calculated by the edX grading system, you must:

* Include requried functions in the JavaScript application.

* Reference functions in the problem XML.

* Write Python code to grade the student interaction.


====================
getState() Function
====================

Your application must contain a ``getState()`` function.

The name of the ``getState()`` function must be the value of the ``get_statefn`` attribute of the ``jsinput `` element for the problem.

For example:

.. code-block:  xml

    <customresponse cfn="vglcfn">
        <jsinput get_statefn="JSObject.getState"
            . . . .

The ``getState()`` function must return the state of all objects as a JSON string.


====================
setState() Function
====================

Your application must contain a ``setState()`` function.

The name of the ``setState()`` function must be the value of the ``set_statefn`` attribute of the ``jsinput `` element for the problem.

For example:

.. code-block:  xml

    <customresponse cfn="vglcfn">
        <jsinput set_statefn="JSObject.setState"
            . . . .

The ``setState()`` function is executed when the student clicks **Check**.

The function saves application's state so that the student can later return to the application and find it as he or she left it.



====================
getGrade() function
====================

Your application must contain a ``getGrade()`` function.

The name of the ``getGrade()`` function must be the value of the ``gradefn`` attribute of the ``jsinput `` element for the problem.

For example:

.. code-block:  xml

    <customresponse cfn="vglcfn">
        <jsinput gradefn="JSObject.getGrade"
            . . . .


The ``getGrade()`` function is executed when the student clicks **Check**. The ``getState()`` function must return the state of objects on which grading is based as a JSON string. 

The JSON string returned by ``getGrade()`` is used by the Python code in the problem to determine the student's results, as explained below (LINK).




***************************************
Grade the Student Response with Python
***************************************

To grade a student's interaction with your JavaScript application, you must write Python code in the problem. When a student clicks **Check**, the Python code parses the JSON string returned by the application's ``getGrade()`` function and determines if the student's submission is correct or not.

.. note:: Grading for JavaScript applications supports determining if a student's submission is correct or not. You cannot give partial credit with JavaScript applications.

In the Python code, you must:

* Enclose all code in a ``script`` element of type ``loncapa/python``. 

* Import ``json``

* Define a function that is executed when the student clicks Check. This function:
  * Is placed before the ``customresponse`` element that defines the problem.
  * By default is named ``vglcfn``
  * Has two parameters:  ``e`` for the submission event, and ``ans``, which is the JSON string returned by the JavaScript function ``getGrade()``.
  * Must return ``True`` if the student's submission is correct, or ``False`` if it is incorrect.

The structure of the Python code in the problem is:

.. code-block::
    <problem>
        <script type="loncapa/python">
            import json
            def vglcfn(e, ans):
                '''
                Code that parses ans and returns True or False
                '''
        </script>
        <customresponse cfn="vglcfn">
        . . . . 
    </problem>


*******************************************************
XML for Custom JavaScript Applications
*******************************************************

The problem component XML that you define in Studio to provide students with a JavaScript application has the following structure:

.. code-block::
    <problem>
        <!-- Optional script tag for summative assessments -->
        <script type="loncapa/python">
            import json
            def vglcfn(e, ans):
                '''
                Code that parses ans and returns True or False
                '''
        </script>
        <customresponse cfn="vglcfn">
            <jsinput 
                gradefn="JSObject.getGrade" 
                get_statefn="JSObject.getState" 
                set_statefn="JSObject.setState" 
                width="100%" 
                height="360" 
                html_file="/static/file-name.html" 
                sop="false"/>
        </customresponse>
    </problem>


===================
jsinput attributes
===================

The following table describes the attributes of the ``jsinput`` element.

.. list-table::
   :widths: 10 80 10
   :header-rows: 1

   * - Attribute
     - Description
     - Example
   * - gradefn
     - The function in your JavaScript application that returns the state of the objects to be evaluated as a JSON string.
     - ``JSObject.getGrade``
   * - get_statefun
     - The function in your JavaScript application that returns the state of the objects. [
     - ``JSObject.getState``
   * - set_statefun
     - The function in your JavaScript application that saves the state of the objects.
     - ``JSObject.setState``
   * - width
     - The width of the IFrame in which your JavaScript application will be displayed, in pixels.
     - 400
   * - height
     - The height of the IFrame in which your JavaScript application will be displayed, in pixels.
     - 400
   * - html_file
     - The name of the HTML file containing your JavaScript application that will be loaded in the IFrame.
     - /static/webGLDemo.html
   * - sop
     - The same-origin policy (SOP), meaning that all elements have the same protocol, host, and port. To bypass the SOP, set to ``true``.
     - false











*******************************
The Template Example
*******************************

As referred to in `course staff documentation <http://edx.readthedocs.org/projec
ts/ca/en/latest/problems_tools/advanced_problems.html#custom-javascript-display-
and-grading>`_, there is a built-in template in Studio that uses a sample
JavaScript application.

This sample application has students select two different shapes, a cone
and a cube. The correct state is when the cone is selected and the cube is not selected:

.. image:: ../images/JavaScriptInputExample.png
  :alt: Image of the sample JavaScript application, with the cone selected 

You can `download files for that application <http://files.edx.org/JSInput.zip>`_. You must upload these files in edX Studio to use them in a problem.

The following information uses this example to explain what developers need to know to embed their JavaScript applications in an edX course.

*******************************
Required JavaScript Functions
*******************************

To enable grading of students' interactions, your JavaScript application must contain three global methods:

* ``getState``
* ``setState``
* ``getGrade``

You reference these methods in the XML problem specification, as described below.

====================
getState() Function
====================

Your application must be able to return the state of objects on which grades will be based.

In the template example, grading is based on the the state of the cylinder and cone objects. The state is initialized for the cylinder and cube in the ``WebGLDemo.js`` file:

.. code-block:: javascript

    var state = {
                'selectedObjects': {
                'cylinder': false,
                'cube': false
                }
    }

User interactions toggle the ``state`` values of the cylinder and cube between ``true`` and ``false``.

Your application must contain a ``getState()`` function that is referenced in the XML problem specification and that returns the current state as a JSON string. 

The following is the ``getState()`` function in the sample application:

.. code-block:: javascript

    function getState() {
        return JSON.stringify(state);
     }


====================
setState() Function
====================

When a student clicks **Check** for the JavaScript problem, the application's state must be saved so that the student can later return to the application and find it in the same state.

Your application must contain a ``setState()`` function that is referenced in the XML problem specification and that saves the current state. 

The following is the ``setState()`` function in the sample application:

.. code-block:: javascript

    function setState() {
        stateStr = arguments.length === 1 ? arguments[0] : arguments[1];
        state = JSON.parse(stateStr);
        updateMaterials();
    }

The ``updateMaterials()`` function called by ``setState()`` updates the state of the cylinder and cone with the user's current selections:

.. code-block:: javascript

    function updateMaterials() {
        if (state.selectedObjects.cylinder) {
            cylinder.material =  selectedMaterial;
        }
        else {
            cylinder.material =  unselectedMaterial;
        }

        if (state.selectedObjects.cube) {
            cube.material =  selectedMaterial;
        }
        else {
            cube.material =  unselectedMaterial;
        }
    }

====================
getGrade() function
====================

The student's interactions with your application, and the resulting application state, must be able to be graded. 

Your application must contain a ``getGrade()`` function that is referenced in the XML problem specification and that returns the current state as a JSON string. 

The following is the ``getGrade()`` function in the sample application:

.. code-block:: javascript

    function getGrade() {
        return JSON.stringify(state['selectedObjects']);
    }

The returned JSON string is then used by the Python code defined in the problem to determine if the student's submission is correct or not, as described in the next section.

*******************************
Grading the Student Response
*******************************

The problem definition contains Python code that, when the student clicks **Check**, parses the JSON string returned by your application's ``getGrade()`` function and determines if the student's submission is correct or not.

The following is the Python function ``vglcfn`` in the sample application:

.. code-block:: python

    <script type="loncapa/python">
    import json
    def vglcfn(e, ans):
        '''
        par is a dictionary containing two keys, "answer" and "state"
        The value of answer is the JSON string returned by getGrade
        The value of state is the JSON string returned by getState
        '''
        par = json.loads(ans)
        # We can use either the value of the answer key to grade
        answer = json.loads(par["answer"])
        return answer["cylinder"] and not answer["cube"]
        '''
        # Or we could use the value of the state key
        state = json.loads(par["state"])
        selectedObjects = state["selectedObjects"]
        return selectedObjects["cylinder"] and not selectedObjects["cube"]
        '''
    </script>

In this example, the ``ans`` parameter contains the JSON string returned by ``getGrade()``. The value is converted to a Python Unicode (?) structure in the variable ``par``.

In the function's first option, object(s) the student selected are stored in the ``answer`` variable.  If the student selected the cylinder and not the cube, the ``answer`` variable contains only ``cylinder``, and the function returns ``True``, which signifies a correct answer.  Otherwise, it returns ``False`` and the answer is incorrect.

In the function's second option, the objects' states are retrieved.  If the cylinder is selected and not the cube, the function returns ``True``, which signifies a correct answer.  Otherwise, it returns ``False`` and the answer is incorrect.


*******************************
XML Problem Structure
*******************************

Following the Python code and any HTML content you want to precede the IFrame containing your JavaScript application, you define the XML for the problem.

The XML problem for the sample template is:

.. code-block:: xml

    <customresponse cfn="vglcfn">
        <jsinput gradefn="WebGLDemo.getGrade"
         get_statefn="WebGLDemo.getState"
         set_statefn="WebGLDemo.setState"
         width="400"
         height="400"
         html_file="/static/webGLDemo.html"
         sop="false"/>
    </customresponse>

As in this example, the JS Input problem is defined in a ``<customresponse>`` element.

The value of the ``cfn`` attribute is the name of the Python function in the problem that evaluates the submission's grade.

The ``<customresponse>`` element contains a ``<jsinput>`` element, which defines how your JavaScript application is used in the course.

Following are details about the attributes of the ``<jsinput>`` element.

===================
jsinput attributes
===================

.. list-table::
   :widths: 10 80 10
   :header-rows: 1

   * - Attribute
     - Description
     - Example
   * - gradefn
     - The function in your JavaScript application that returns the state of the objects to be evaluated as a JSON string.
     - ``WebGLDemo.getGrade``
   * - get_statefun
     - The function in your JavaScript application that returns the state of the objects. [NOT CLEAR TO ME WHY YOU NEED BOTH getGrade and setState]
     - ``WebGLDemo.getState``
   * - set_statefun
     - The function in your JavaScript application that saves the state of the objects.
     - ``WebGLDemo.setState``
   * - width
     - The width of the IFrame in which your JavaScript application will be displayed, in pixels.
     - 400
   * - height
     - The height of the IFrame in which your JavaScript application will be displayed, in pixels.
     - 400
   * - html_file
     - The name of the HTML file containing your JavaScript application that will be loaded in the IFrame.
     - /static/webGLDemo.html
   * - sop
     - The same-origin policy (SOP), meaning that all elements have the same protocol, host, and port. To bypass the SOP, set to ``true``.
     - false
