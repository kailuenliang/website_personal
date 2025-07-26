

Kai-Luen Portfolio Website...

Made in Bootstrap, modified from this bootstrap template.
https://startbootstrap.com/theme/freelancer

Changes:
1. made sections more modular into separate html files.
Using Jinja to include into index... 
   
    {% include 'projects.html' %}

2. Each project is its own html...if confused just use the reverberations.html as main template for each individual project 
   a. Change name to project name.
   b. Change data-target to different number
   ie. "#portfolioModal3"
   c. Make sure id below is also set to the same, without the hash
   id= "portfolioModal3"
   
3. Portfolio is where the projects grid in the main index.html lives.
---make sure to include the html file using
   {% include 'blahblah.html' %} to render in portfolio
   