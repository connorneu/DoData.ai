$(document).ready(function () {
    var root_node_name = "Algorithm Type"
    var action_color = "coral";
    var standard_color = "white";
    var fyi_color = "cyan";
    var data = 
    {
    name: root_node_name,
    children: [
        {
            name: "Move Data",
            children: [
                {
                    name: "Search",
                    image: "/static/images/Extract v3.png",
                    children: [{
                            name: "START"                        
                        }
                    ]                           
                },
                {
                    name:"Combine",
                    image: "/static/images/Combine V4.png",
                    children: [{
                            name: "START"                        
                        }
                    ]
                },
                {
                    name:"Update",
                    image: "/static/images/Update v3.png",
                    children: [
                        {
                            name: "START" 
                        }
                    ]
                },
            ]
        }, 
        {
            name: "Analyze Data",
            children: [
                {
                    name: "Calculate",
                    image: "/static/images/Column.png",
                    children: [
                        {
                            name: "START"
                        }
                    ]
                },  
                {
                    name: "Group",
                    image: "/static/images/Calculate v3.png",
                    children: [
                        {
                            name: "START"
                        }
                    ]
                },  
                {
                    name: "Reconcile",
                    image: "/static/images/Reconcile v3.png",
                    children: [
                        {
                            name: "START"
                        }
                    ]
                },
                {
                    name: "Filter",
                    image: "/static/images/Filter.png",
                    children: [
                        {
                            name: "START"
                        }
                    ]
                }                             
            ]
        },                                                        
        ]
    };

    var margin = {
            top: 0, //20
            right: 180,   // 90
            bottom: 0,  //30
            left: 250     // 90
        },
        width = 4000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3
        .select("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")      
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var i = 0,
        duration = 750,
        root;

    var treemap = d3.tree().size([height, width]);

    root = d3.hierarchy(data, function(d) {
        return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;


    root.children.forEach(collapse);
    update(root);
    
    function update(source) {
        // Compute the new tree layout
        var treeData = treemap(root);

        // Normalize for fixed-depth
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        nodes.forEach(function(d) {
            d.y = d.depth * 340;   //d.y = d.depth * 180;
        });

        // Update the nodes
        var node = svg.selectAll("g.node").data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

        // Enter any new nodes at the parent's previous position
        var nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", click);

        nodeEnter
            .append("circle")
            .attr("r", 1e-6)  //
            .style("fill", function(d) {
                return d._children ? action_color : fyi_color;  //return d._children ? "lightsteelblue" : "#fff";     action_color : fyi_color
            });

        // move text to front
        nodeEnter
            .append("text")  //text
            .attr("x", function(d) {
                return 50; //return d.children || d._children ? -13 : -13;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                return "start";     //return d.children || d._children ? "end" : "start";
            })
            .attr("class", "text-node")
            .text(function(d) {
                return d.data.name;
            })
            .call(wrap, 300);
            

        nodeEnter
            .append("image")
            .attr("xlink:href", function(d) {
                return d.data.image;
            })
            .attr("x", 110)  //116
            .attr("y", -25)     //-25
            .attr("width", 500)       //50
            .attr("height", 500);

         nodeEnter
            .attr("class", "node parent-node")         

        // Transition nodes to their new position
        var nodeUpdate = node
            .merge(nodeEnter)
            .transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
        nodeUpdate
            .select("circle")
            .attr("r", 24)
            .style("fill", function(d) {
                return d._children ? 'url(#grad)' : '#7196dd';               //return d._children ? "lightsteelblue" : "#fff";   action_color : fyi_color
            
            })
            .attr('stroke', "black")
            .attr('class','front');
   
        // Transition exiting nodes to the parent's new position
        var nodeExit = node
            .exit()
            .transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();
        

        nodeExit.select("circle").attr("r", 1e-6);

        // Update the links
        var link = svg.selectAll("path.link").data(links, function(d) {
            return d.id;
        });

        // Enter any new links at the parent's previous position
        var linkEnter = link
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal(o, o);
            });

        // Transition links to their new position
        link
            .merge(linkEnter)
            .transition()
            .duration(duration)
            .attr("d", function(d) {
                return diagonal(d, d.parent);
            });

        // Transition exiting nodes to the parent's new position
        link
            .exit()
            .transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal(o, o);
            })
            .remove();

        // Stash the old positions for transition
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;            
        });
       

        //force_text_background('parent-node');
        force_first_node_as_active('parent-node', root_node_name);
        adjust_svg_img_y_pos('node parent-node');

    }

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
        path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;
        return path;
    }

    // Toggle children on click
    function click(event, d) {
        if (d.children) {
            //close node
            d._children = d.children;
            d.children = null; 
            //event.currentTarget.attr("class", "node parent-node active");
            $(event.currentTarget).removeClass("active");             
            scroll_graph('algo-desc-graph', 'close');
        } else {
            // open node
            d.children = d._children;
            d._children = null;
            //event.currentTarget.attr("class", "node parent-node active");
             
            if (d.children){
                scroll_graph('algo-desc-graph', 'open');
                $(event.currentTarget).addClass("active");
            }  
            start_algo_path(d.data.name, d.parent.data.name);
            
        }
        //remove selected tag showing description from text generated suggestion
        $(event.currentTarget).removeClass("selected");
        update(d);
    }

    // Collapse the node and all of its children
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    function scroll_graph(svg_elem, action_type){
        //$('.node.parent-node.active').scrollLeft('500px');
        //$('.node.parent-node.active').last()[0].scrollIntoView()
        //myDiv.scrollLeft = myDiv.scrollWidth;
        var myDiv = document.getElementById(svg_elem);
        if (action_type === 'open'){
            myDiv.scrollLeft = myDiv.scrollLeft + 234;
        }
        else{
            myDiv.scrollLeft = myDiv.scrollLeft - 234;
        }
    }
});


// EXPANDING TREE
function force_text_background(class_name){
    var parent_nodes = document.getElementsByClassName(class_name);
    for (var i = 0; i<parent_nodes.length; i++){       
        var text_node = parent_nodes[i].getElementsByClassName('text-node')[0]
        var SVGRect = text_node.getBBox();
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", SVGRect.x);
        rect.setAttribute("y", SVGRect.y);
        rect.setAttribute("width", SVGRect.width);
        rect.setAttribute("height", SVGRect.height);
        rect.setAttribute("fill", "black");
        parent_nodes[i].insertBefore(rect, text_node);
    }               
}

function adjust_svg_img_y_pos(class_name){
    var parent_nodes = document.getElementsByClassName(class_name);
    var both_parent_nodes_active = false;
    var one_parent_node_active = false;
    for (var i = 0; i<parent_nodes.length; i++){ 
        var node = $(parent_nodes[i]).closest('.node');
        if (node.hasClass('active')){
            var txt = node.find('tspan').text();
            if (txt.includes('Move Data') || txt.includes('Analyze Data')){
                if(one_parent_node_active){
                   both_parent_nodes_active=true; 
                   console.log('TRE')
                }
                else{
                    one_parent_node_active=true;
                }
            }
        }
        var node_name = parent_nodes[i].getElementsByTagName('tspan')[0].innerHTML;
        if (node_name === 'Combine'){
            if(!both_parent_nodes_active){
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-220); 
            }
            else{
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-90); 
            }
               
        }
        if (node_name === 'Update'){
            if(!both_parent_nodes_active){
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-420);
            }
            else{
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-150);
            }
                
        } 
        if (node_name === 'Reconcile'){
            if(!both_parent_nodes_active){
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-320); 
            }
            else{
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-420); 
            }
               
        }
        if (node_name === 'Group'){
            if(!both_parent_nodes_active){
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-170);    
            }
            else{
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-350);    
            }
            
        }
        if (node_name === 'Calculate'){  
            if(!both_parent_nodes_active){
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-20);   
            }
            else{
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-280);  
            } 
        }
        if (node_name === 'Filter'){
            if(!both_parent_nodes_active){
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-470);     
            }
            else{
                var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-490);    
            } 
            
        }
    }
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),     
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 50).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 50).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function force_first_node_as_active(class_name, root_node_name){
    var parent_nodes = document.getElementsByClassName(class_name);
    for (var i = 0; i<parent_nodes.length; i++){
        var x_tempt = parent_nodes[i].getElementsByTagName("text")[0]
        if(x_tempt.__data__.data.name === root_node_name){
            parent_nodes[i].setAttribute("class", "node parent-node active");
        }
    }
}