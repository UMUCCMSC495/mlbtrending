Ext.define('MlbApp.view.TeamChart', {
    extend: 'Ext.Panel',
    alias: 'widget.teamchart',
    xtype: 'basic-line',
	itemId: 'teamchart',
    padding: '10 10 10 10',

    initComponent: function() {
        var me = this;

        me.items = [{
            xtype: 'panel',
            html: '<p>Select a team above.</p>'
        }];

        this.callParent();
    },
    
    plot: function(abbr) {
        var me = this;
        
    	Ext.Ajax.request({
    		url: MlbApp.common.Globals.root + 'api/stats/' + abbr + '/month',
    		success: function(response)
    		{
    			var stats = Ext.JSON.decode(response.responseText, true);
                
                var chartTitle = 'Win Rate';
                var yAxisRenderer = function(v) { return v + '%'; };
                
                var chartData = Ext.create('Ext.data.JsonStore', {
                    fields: ['month', 'data1', 'data2'],
                    data: [
                        { month: 'Jan', data1: 20, data2: 19 },
                        { month: 'Feb', data1: 20, data2: 18 },
                        { month: 'Mar', data1: 19, data2: 16 },
                        { month: 'Apr', data1: 18, data2: 14 },
                        { month: 'May', data1: 18, data2: 15 }
                    ]
                });
                
                var chart = new Ext.chart.Chart({
                    legend: {
                        position: 'bottom'
                    },
                    height: 410,
                    width: 780,
                    padding: '10 0 0 0',

                    style: {
                        'background' : '#fff'
                    },
                    animate: true,
                    shadow: false,
                    store: chartData,
                    insetPadding: 40,
                    items: [{
                        type  : 'text',
                        text  : stats.city + ' ' + stats.name,
                        font  : '22px Helvetica',
                        width : 100,
                        height: 30,
                        x : 40, //the sprite x position
                        y : 12  //the sprite y position
                    }],
                    axes: [{
                        type: 'numeric',
                        fields: ['data1','data2'],
                        position: 'left',
                        grid: true,
                        minimum: 0,
                        label: {
                            renderer: yAxisRenderer
                        },
                        title: chartTitle
                    }, {
                        type: 'category',
                        fields: 'month',
                        position: 'bottom',
                        grid: true,
                        label: {
                            rotate: {
                                degrees: -45
                            }
                        }
                    }],
                    series: [{
                        type: 'line',
                        axis: 'left',
                        xField: 'month',
                        yField: 'data1',
                        style: {
                            'stroke-width': 4
                        },
                        markerConfig: {
                            radius: 4
                        },
                        highlight: {
                            fill: '#000',
                            radius: 5,
                            'stroke-width': 2,
                            stroke: '#fff'
                        },
                        tips: {
                            trackMouse: true,
                            style: 'background: #FFF',
                            height: 20,
                            showDelay: 0,
                            dismissDelay: 0,
                            hideDelay: 0,
                            renderer: function(storeItem, item) {
                                this.setTitle(storeItem.get('month') + ': ' + storeItem.get('data1') + '%');
                            }
                        }
                    },{
                        type: 'line',
                        axis: 'left',
                        xField: 'month',
                        yField: 'data2',
                        style: {
                            'stroke-width': 4
                        },
                        markerConfig: {
                            radius: 4
                        },
                        highlight: {
                            fill: '#000',
                            radius: 5,
                            'stroke-width': 2,
                            stroke: '#fff'
                        },
                        tips: {
                            trackMouse: true,
                            style: 'background: #FFF',
                            height: 20,
                            showDelay: 0,
                            dismissDelay: 0,
                            hideDelay: 0,
                            renderer: function(storeItem, item) {
                                this.setTitle(storeItem.get('month') + ': ' + storeItem.get('data1') + '%');
                            }
                        }

                    }]
                });

                me.removeAll();
                me.add(chart);
                me.doLayout();
            },
            failure: function(response)
            {
                var errPanel = new Ext.panel.Panel({
                    html: '<p>An error occurred while retrieving the data.</p>',
                });
                me.removeAll();
                me.add(errPanel);
                me.doLayout();
            }
        });
    }
});