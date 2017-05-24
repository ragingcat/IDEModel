/**
 * Sample VIEW script.
 *
 * @author Stagejs.CLI
 * @created Tue Feb 14 2017 17:33:43 GMT-0800 (PST)
 */
;
(function(app) {

    app.view('Models.Display', {
        template: '@view/models/display.html',
        svg: {
            topo: function(paper) {
                console.log(paper);
                console.log(this.cur);
                var that = this;
                app.remote({
                    url: '/model/models/',
                    params: {
                        // app: that.data ? that.data.app || '' : (that.cur || '')
                        app: (that.cur || '')
                    }
                }).then(function(data) {
                    that.data = {};
                    that.data['raw'] = _.clone(data);
                    var indvSizes = [{
                        circle: 20,
                        text: 22,
                        charge: -2500,
                        distance: 120
                    }, {
                        circle: 8,
                        text: 10,
                        charge: -500,
                        distance: 100
                    }, {
                        circle: 10,
                        text: 12,
                        charge: -400,
                        distance: 70
                    }, {
                        circle: 6,
                        text: 12,
                        charge: -200,
                        distance: 50
                    }, {
                        circle: 3,
                        text: 6,
                        charge: -100,
                        distance: 30
                    }, {
                        circle: 2,
                        text: 3,
                        charge: -100,
                        distance: 10
                    }, ];

                    function getDimn(len) {
                        return indvSizes[0];
                    }
                    // var dimn = data.length > 50 ? indvSizes[1] : indvSizes[0];
                    var dimn = getDimn(data.length);
                    // console.log("dimn", dimn);
                    var links = [];
                    // var connsMeta = data.reduce(function(acc, val){
                    //     var k = val.startSN + val.startPort;
                    //     var k2 = val.endSN + val.endPort;
                    //     if(!acc[k + k2] && !acc[k2 + k]){
                    //         acc[k + k2] = {
                    //             source: val.startSN,
                    //             target: val.endSN,
                    //             sourceName: that.data['ungrouped'][val.startSN] ? that.data['ungrouped'][val.startSN].platform || '' : '',
                    //             targetName: that.data['ungrouped'][val.endSN] ? that.data['ungrouped'][val.endSN].platform || '' : '',
                    //             type: 'suit'
                    //         };
                    //     }
                    //     return acc;
                    // }, {});
                    var lineCnt = {
                        "many_to_one": 3,
                        "one_to_one": 1,
                        "many_to_many": 3
                    };
                    _.each(data, function(v, k) {
                        _.each(v.relations, function(r, name) {
                            if (r.relation === 'one_to_one' || k === r.related_model) {
                                links.push({
                                    source: k,
                                    target: r.related_model,
                                    type: r.relation,
                                    order: 0,
                                });
                            } else {
                                // for(var i = 0; i < lineCnt[r.relation]; i++){
                                links.push({
                                    source: k,
                                    target: r.related_model,
                                    type: r.relation,
                                    order: 0,
                                });
                                // }                                
                            }
                        });
                    });
                    var nodes = {}, linkPaths = {}, nodePaths = {};

                    // Compute the distinct nodes from the links.
                    links.forEach(function(link) {
                        link.source = nodes[link.source] || (nodes[link.source] = {
                            name: link.source,
                            title: data[link.source].verbose_name + '(' + link.source + ')'
                        });
                        link.target = nodes[link.target] || (nodes[link.target] = {
                            name: link.target,
                            title: data[link.target] ? data[link.target].verbose_name + '(' + link.target + ')' : link.target
                        });
                        if(linkPaths[link.target.name + link.source.name]){
                            // reverse link exist, modify reverse link attr
                            linkPaths[link.source.name + link.target.name] = {offset: {x: '0em', y: '1.5em'}, archOrder: 0};
                            linkPaths[link.target.name + link.source.name] = {offset: {x: '0em', y: '-1em'}, archOrder: 1};
                        }else{
                            linkPaths[link.source.name + link.target.name] = {offset: {x: '0em', y: '-1em'}, archOrder: 2};
                        }
                        if(!nodePaths[link.source.name]){
                            nodePaths[link.source.name] = {self: null, peers: []};
                        }
                        nodePaths[link.source.name].peers.push(link.target.name);
                        if(!nodePaths[link.target.name]){
                            nodePaths[link.target.name] = {self: null, peers: []};
                        }
                        nodePaths[link.target.name].peers.push(link.source.name);
                    });

                    var width = paper.getSize().width,
                        height = paper.getSize().height;

                    var force = d3.layout.force()
                        .nodes(d3.values(nodes))
                        .links(links)
                        .size([width, height])
                        // .size([800, 600])
                        .linkDistance(dimn.distance)
                        .charge(dimn.charge)
                        .on("tick", tick)
                        .start();

                    var svg = paper.d3
                        .attr("width", width)
                        .attr("height", height);
                    // var refYs = {"many_to_one": -2.5, "one_to_one": -.3, "many_to_many": 2.5};
                    var refYs = {
                        "order0": -1.5,
                        "order1": 0,
                        "order2": 1.5
                    };

                    // Per-type markers, as they don't inherit styles.
                    svg.append("defs").selectAll("marker")
                        // .data(["many_to_one", "one_to_one", "many_to_many"])
                        .data(["order0", "order1", "order2", "roder0", "rorder1", "rorder2"])
                        .enter().append("marker")
                        .attr("id", function(d) {
                            return d;
                        })
                        .attr("viewBox", "0 -5 10 10")
                        .attr("refX", 20)
                        // .attr("refY", -.5)
                        .attr("refY", function(d) {
                            return refYs[d];
                        })
                        .attr("markerWidth", 12)
                        .attr("markerHeight", 12)
                        .attr("orient", "auto")
                        .append("path")
                        .attr("d", function(d) {
                            if (d.startsWith('roder')) {
                                return "M0,-5L10,0L0,5"
                            } else {
                                return "M0,-5L10,0L0,5"
                            }
                        });
                    // .attr("d", "M0,-5L10,0L0,5");
                    var stroke_widths = {
                        "many_to_one": 2,
                        "one_to_one": 1,
                        "many_to_many": 4
                    };
                    var relationTitle = {
                        "many_to_one": 'm : 1',
                        "one_to_one": '1 : 1',
                        "many_to_many": 'm : m'
                    };

                    var path = svg.append("g").selectAll("path")
                        .data(force.links())
                        .enter().append("path")
                        .attr("stroke-width", function(d) {
                            return stroke_widths[d.type];
                        })
                        .attr("class", function(d) {
                            return "link " + d.type;
                        });
                    // .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
                    // .attr("marker-start", function(d) { return d.type === 'many_to_many' ? "url(#rorder" + d.order + ")" : ''; })
                    // .attr("marker-end", function(d) { return "url(#order" + d.order + ")"; });
                    // Set the ranges
                    var x = d3.time.scale().range([0, width]);
                    var y = d3.scale.linear().range([height, 0]);

                    var circle = svg.append("g").selectAll("circle")
                        .data(force.nodes())
                        .enter().append("circle")
                        .attr("r", dimn.circle)
                        .on('mouseover', function(d, i) {
                            // console.log("i", i);
                            d3.select(this).append("text")
                                .text(d.x)
                                .attr("x", x(d.x))
                                .attr("y", y(d.y));
                        })
                        .call(force.drag);

                    _.each(force.nodes(), function(v, k){
                        if(nodePaths[v.name]){
                            nodePaths[v.name].self = v;
                        }else{
                            console.log(v.name);
                        }
                    });
                    var text = svg.append("g").selectAll("text")
                        .data(_.union(force.nodes(), force.links()))
                        .enter().append("text")
                        // .attr("x", dimn.text)
                        // .attr("y", ".31em")
                        .attr("class", function(d) {
                            // console.log(d.source);
                            if (d.source)
                                return 'relation ' + d.source.name + d.target.name;
                            else
                                return 'node';
                        })
                        // .attr("x", function(d) { if(d.source) return '0em';  else  return dimn.text; })
                        // .attr("y", function(d) { if(d.source) return '-1em';  else  return '.31em'; })
                        .attr("x", function(d) {
                            if (d.source)
                                return '0em';
                            else
                                return dimn.text;
                        })
                        .attr("y", function(d) {
                            if (d.source){
                                return linkPaths[d.source.name + d.target.name].offset.y;
                                // return '-1em';
                            }
                            else
                                return '.31em';
                        })
                        .text(function(d) {
                            if (d.source) {
                                if (d.source.name === d.target.name) {
                                    return '';
                                } else {
                                    return relationTitle[d.type];
                                }
                            } else return d.title;
                        });

                    that.$el.find('[data-toggle="tooltip"]').tooltip();


                    // Use elliptical arc path segments to doubly-encode directionality.
                    function tick() {
                        path.attr("d", linkArc);
                        circle.attr("transform", transform);
                        text.attr("transform", transform);
                    }

                    var arcs = [];
                    console.log(linkPaths);
                    function linkArc(d) {
                        var dx = d.target.x - d.source.x,
                            dy = d.target.y - d.source.y,
                            k = "M" + d.source.x + "," + d.source.y + d.target.x + "," + d.target.y,
                            dr = Math.sqrt(dx * dx + dy * dy);
                        // if(dx === 0 && dy === 0){
                        if (d.source.name === d.target.name) {
                            // cicle to itself
                        } else {
                            if(linkPaths[d.source.name + d.target.name].archOrder === 0){
                                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + (d.target.x - 0) + "," + d.target.y;
                            }else if(linkPaths[d.source.name + d.target.name].archOrder === 1){
                                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + (d.target.x + 0) + "," + d.target.y;
                            }else{
                                return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                            }
                        }
                    }

                    function transform(v) {
                        var d;
                        if(v.source){
                            d = v;
                        }else{
                            d = _.extend({}, v, {source: nodePaths[v.name].self, target: nodePaths[nodePaths[v.name].peers[0]].self, isNode: true});
                            // if(nodePaths[v.name]){
                            //     d = _.extend({}, v, {source: nodePaths[v.name].self, target: nodePaths[nodePaths[v.name].peers[0]], isNode: true});
                            // }else{
                            //     d = _.extend({}, v, {isNode: true});
                            // }
                        }
                        if (!d.isNode) {
                            var xx = (d.source.x + d.target.x) / 2,
                                yy = (d.source.y + d.target.y) / 2,
                                deg = 0;
                            if (d.target.x > d.source.x) {
                                if (d.target.y > d.source.y) {
                                    // from left top to right bottom
                                    // console.log("from left top to right bottom");
                                    deg = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
                                    deg = (deg) * (180 / Math.PI);
                                } else {
                                    // from left bottom to right top
                                    // console.log("from left bottom to right top");
                                    deg = Math.atan2(d.source.y - d.target.y, d.target.x - d.source.x);
                                    deg = 0 - (deg) * (180 / Math.PI);
                                }
                            } else {
                                if (d.target.y > d.source.y) {
                                    // from right top to left bottom
                                    // console.log('from right top to left bottom');
                                    // deg = Math.atan2(d.source.y - d.target.y, d.source.x - d.target.x);
                                    deg = Math.atan2(d.target.y - d.source.y, d.source.x - d.target.x);
                                    deg = 0 - (deg) * (180 / Math.PI);
                                } else {
                                    // from right bottom to left top
                                    // console.log('from right bottom to left top');
                                    deg = Math.atan2(d.source.y - d.target.y, d.source.x - d.target.x);
                                    deg = (deg) * (180 / Math.PI);
                                }
                            }
                            // console.log(deg);
                            //       deg = (deg) * (180 / Math.PI);
                            // console.log(deg);
                            // console.log(d.source.x, d.source.y);
                            // console.log(d.target.x, d.target.y);
                            return "translate(" + xx + "," + yy + ") " + "rotate(" + deg + ")";
                        } else {

                            var xx = (d.source.x + d.target.x) / 2,
                                yy = (d.source.y + d.target.y) / 2,
                                deg = 0;
                            if (d.target.x > d.source.x) {
                                if (d.target.y > d.source.y) {
                                    // from left top to right bottom
                                    // console.log("from left top to right bottom");
                                    deg = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
                                    deg = -(deg) * (180 / Math.PI);
                                } else {
                                    // from left bottom to right top
                                    // console.log("from left bottom to right top");
                                    deg = Math.atan2(d.source.y - d.target.y, d.target.x - d.source.x);
                                    deg = (deg) * (180 / Math.PI);
                                }
                            } else {
                                if (d.target.y > d.source.y) {
                                    // from right top to left bottom
                                    // console.log('from right top to left bottom');
                                    // deg = Math.atan2(d.source.y - d.target.y, d.source.x - d.target.x);
                                    deg = Math.atan2(d.target.y - d.source.y, d.source.x - d.target.x);
                                    deg = (deg) * (180 / Math.PI);
                                } else {
                                    // from right bottom to left top
                                    // console.log('from right bottom to left top');
                                    deg = Math.atan2(d.source.y - d.target.y, d.source.x - d.target.x);
                                    deg = -(deg) * (180 / Math.PI);
                                }
                            }
                            // console.log(deg);
                            //       deg = (deg) * (180 / Math.PI);
                            // console.log(deg);
                            // console.log(d.source.x, d.source.y);
                            // console.log(d.target.x, d.target.y);
                            return "translate(" + d.x + "," + d.y + ")";
                            // return "translate(" + d.x + "," + d.y + ") " + "rotate(" + deg + ")";
                        }
                    }
                }).fail(function(data, textStatus, jqXHR) {

                });

            },
        },
        initialize: function() {
            this.ready = false;
            this.cur = this.data ? this.data.app || '' : '';
            this.baseUrl = 'Models/Models.Display/';
            app.navigate(this.baseUrl + this.cur);

        },
        onBeforeNavigateTo: function(subpath) {
            console.log(subpath);
            if (!this.ready && subpath) {
                this.cur = subpath;
                app.navigate(this.baseUrl + this.cur);
            }
        },
        onReady: function() {
            console.log('msg');
        },
        actions: {
            open: function(el) {
                app.view({
                    template: [
                        '<div class="modal-dialog text-left">',
                        '<div class="modal-content">',
                        '<div class="modal-header">',
                        '<h4 class="pull-left modal-title current-title"><i class="icon-upload"></i><span>{{title}}</span></h4>',
                        '<div class="pull-right btn btn-xs btn-link" action="close">Close</div>',
                        '</div>',
                        '<div class="modal-body" region="body">',
                        '<div editor="modelFile"></div>',
                        '</div>',
                        '</div>',
                        '</div>',
                    ],
                    editors: {
                        modelFile: {
                            // label: 'File2',
                            type: 'file',
                            help: 'Please choose your model file to upload.',
                            // fieldname: 'configFile',
                            multiple: true,
                            upload: {
                                standalone: true,
                                url: '/model/upload/',
                                callbacks: {
                                    always: function(e, data) {
                                        this.status({
                                            type: data.result.code === 0 ? 'success' : 'error',
                                            msg: data.result.status
                                        });
                                    }
                                }
                            }

                        },
                    },
                    actions: {
                        close: function() {
                            this.close();
                        },
                    },
                }).create({
                    data: {
                        title: "Open"
                    }
                }).overlay({
                    effect: false,
                    class: 'overlay-overflow-y overlay-overflow-x',
                });
            }
        },
    });
})(Application);