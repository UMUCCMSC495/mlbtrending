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
                
                var dataFields = ['month'];
                var axisFields = [];
                var chartSeries = [];
                var i = 1;
                Ext.iterate(stats.data.years, function(year, yearData) {
                    dataFields.push(year);
                    axisFields.push(year);
                    
                    chartSeries.push({
                        type: 'line',
                        axis: 'left',
                        xField: 'month',
                        yField: year,
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
                                this.setTitle(storeItem.get('month') + ': ' + storeItem.get(year) + '%');
                            }
                        }
                    });
                    
                    i++;
                });
                
                var chartDataPoints = [];
                
                for (var i = 0; i < stats.data.series.months.length - 2; i++) {
                    var dataPoint = { month: stats.data.series.months[i] };
                    
                    var j = 1;
                    Ext.iterate(stats.data.series.years, function(year, yearData) {
                        if (i < yearData.winrates.length) {
                            var winrate = parseFloat((yearData.winrates[i] * 100).toFixed(0));
                            dataPoint[year] = winrate;
                        }
                        j++;
                    });
                    
                    chartDataPoints.push(dataPoint);
                }
                
                var chartData = Ext.create('Ext.data.JsonStore', {
                    fields: dataFields,
                    data: chartDataPoints
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
                        fields: axisFields,
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
                    series: chartSeries
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