---
layout: ../../../layouts/ArticleLayout.astro
title:  Dash HTML Components Overview
---



## Introduction

Dash HTML Components are a set of pre-built components that allow you to create HTML elements in your Dash applications. They are part of the `dash_html_components` library and provide a simple way to create and style HTML elements using Python.

With Dash HTML Components, you can create a wide variety of HTML elements such as divs, headings, paragraphs, lists, tables, and more. You can also apply CSS styles to these components to customize their appearance.

The CSS styles can be given inside the application code as a dictionary or can be given in an external CSS file. The components also support various attributes that allow you to control their behavior and appearance. For example, you can set the `id` attribute to uniquely identify a component, or use the `className` attribute to apply CSS classes for styling.

We will dive into the details of how to use Dash HTML Components in the real projects in the upcoming sections. For now, let's take a look at some of the commonly used Dash HTML Components and their attributes.


## Commonly Used Dash HTML Components


### Div

The `Div` component is a container that can hold other components. It is often used to group related components together and apply styles to them.

```python
import dash_html_components as html
html.Div(
    children=[
        html.H1("Hello, Dash!"),
        html.P("This is a paragraph inside a div.")
    ],
    style={'backgroundColor': 'lightblue', 'padding': '20px'}
)
``` 

Here we have created a `Div` component that contains a heading and a paragraph. We have also applied some CSS styles to the `Div` to give it a light blue background and some padding.

The `children` attribute is used to specify the components that are contained within the `Div`. You can add as many components as you like inside the `children` list. The `style` attribute is used to apply CSS styles to the component. It takes a dictionary where the keys are CSS property names and the values are the corresponding CSS values. In this example, we set the background color to light blue and added some padding around the content.

### Heading

The `H1`, `H2`, `H3`, `H4`, `H5`, and `H6` components are used to create headings of different levels. The number in the component name indicates the level of the heading, with `H1` being the highest level and `H6` being the lowest.

```python
html.H1("This is a Heading 1")
html.H2("This is a Heading 2")
html.H3("This is a Heading 3")
html.H4("This is a Heading 4")
html.H5("This is a Heading 5")
html.H6("This is a Heading 6")
```

In this example, we have created six different heading components, each with a different level. The text inside the parentheses is the content of the heading. You can style these headings using the `style` attribute in the same way as we did with the `Div` component.

### Paragraph

The `P` component is used to create a paragraph of text. It can contain any text content and can also be styled using the `style` attribute.

```python 
html.P("This is a paragraph of text.", style={'color': 'red', 'fontSize': '20px'})
``` 

In this example, we have created a `P` component that contains a paragraph of text. We have also applied some CSS styles to the paragraph to change its color to red and increase the font size to 20 pixels.

### List

The `Ul` and `Ol` components are used to create unordered and ordered lists, respectively. The `Li` component is used to create list items within these lists.

```python
html.Ul(
    children=[
        html.Li("Item 1"),
        html.Li("Item 2"),
        html.Li("Item 3")
    ]
)
```

**When should we write `children` ?**

In Dash, the `children` attribute is used to specify the components that are contained within a parent component. You should use the `children` attribute when you want to nest components inside another component. For example, when you want to create a `Div` that contains multiple components, you would use the `children` attribute to list those components. 

In the example above, we have created an unordered list (`Ul`) that contains three list items (`Li`). We used the `children` attribute to specify the list items that are part of the unordered list. Each `Li` component represents a single item in the list. If we don't use the `children` attribute, we would not be able to specify the list items that belong to the unordered list, and the structure of our HTML would be incorrect.

### Table

The `Table`, `Tr`, `Th`, and `Td` components are used to create tables in Dash. The `Table` component is the container for the entire table, while the `Tr` component represents a table row, the `Th` component represents a table header cell, and the `Td` component represents a table data cell.

<details>
<summary> Click to see the code </summary>

```python
html.Table(
    children=[
        html.Tr(
            children=[
                html.Th("Header 1"),
                html.Th("Header 2"),
                html.Th("Header 3")
            ]
        ),
        html.Tr(
            children=[
                html.Td("Row 1, Cell 1"),
                html.Td("Row 1, Cell 2"),
                html.Td("Row 1, Cell 3")
            ]
        ),  
        html.Tr(
            children=[
                html.Td("Row 2, Cell 1"),
                html.Td("Row 2, Cell 2"),
                html.Td("Row 2, Cell 3")
            ]
        )
    ]
)
``` 
</details>


### Image

The `Img` component is used to display images in Dash. It takes the `src` attribute to specify the URL of the image and the `alt` attribute to provide alternative text for the image.

```python
html.Img(
    src='https://www.example.com/image.jpg', 
    alt='Example Image', 
    # add caption for the image
    figCaption='This is an example image.',
    # title 
    title='Example Image',
    style={'width': '200px'})
```

In this example, we have created an `Img` component that displays an image from the specified URL. We have also provided alternative text for the image using the `alt` attribute, which is important for accessibility. Additionally, we have added a caption for the image using the `figCaption` attribute and a title using the `title` attribute. Finally, we have applied some CSS styles to set the width of the image to 200 pixels.

For better showcase of images, with zooming and panning capabilities, you can use the `dcc.Graph` component from the `dash_core_components` library to display images as well. This allows for more interactive image viewing experiences in your Dash applications. 

To add download functionality for the image, you can use the `html.A` component to create a link that allows users to download the image when clicked. Here's an example of how to do this:

Add downloading functionality for the image inside the image:

```python
html.Div(
    children=[
        html.Img(
            src='https://www.example.com/image.jpg', 
            alt='Example Image', 
            figCaption='This is an example image.',
            title='Example Image',
            style={'width': '200px'}
        ),
        html.A(
            'Download Image',
            href='https://www.example.com/image.jpg',
            download='example_image.jpg',
            style={'display': 'block', 'marginTop': '10px'}
        )
    ]
)
```

In this example, we have wrapped the `Img` component inside a `Div` and added an `A` component below it. The `A` component creates a link that says "Download Image". The `href` attribute specifies the URL of the image to be downloaded, and the `download` attribute specifies the filename that will be used when the image is downloaded. We also applied some CSS styles to display the link as a block element and add some margin above it for better spacing. When users click on the "Download Image" link, they will be prompted to download the image file.


### Link

The `A` component is used to create hyperlinks in Dash. It takes the `href` attribute to specify the URL of the link and the `children` attribute to specify the text that will be displayed for the link.

```python
html.A(
    'Click here to visit Dash documentation',
    href='https://dash.plotly.com/',
    target='_blank',
    style={'color': 'blue', 'textDecoration': 'underline'}
)
``` 


### HTML Tag Components

HTML Tag components have `children`, `id`, `className`, and `style` attributes. The `children` attribute is used to specify the content that will be displayed inside the component. The `id` attribute is used to uniquely identify the component, which can be useful for styling and interactivity. The `className` attribute is used to apply CSS classes to the component for styling purposes. The `style` attribute is used to apply inline CSS styles directly to the component.


### Span 

The `Span` component is an inline container that can hold other components or text. It is often used to apply styles to a specific portion of text or to group inline elements together.

```python
html.Span(
    children=[
        "This is a span of text with ",
        html.Strong("strong emphasis"),
        " and ",
        html.Em("emphasis")
    ],
    style={'color': 'green', 'fontSize': '18px'}
)
```

We can use `Span` instead of `Div` when we want to apply styles to a specific portion of text or to group inline elements together. For example, if we want to style a specific word or phrase within a paragraph, we can wrap that word or phrase in a `Span` component and apply the desired styles to it. This allows us to have more control over the styling of specific parts of our content without affecting the entire block of text, which is what would happen if we used a `Div` component instead.


### Section

The `Section` component is a semantic container that represents a standalone section of content. It is often used to group related content together and can be styled using the `style` attribute. All differences between `Section`, `Span` and `Div` are given below:

- 









