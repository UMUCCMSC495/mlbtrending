Ext.define('MlbApp.view.TeamChart', {
	    extend: 'Ext.Panel',
	    alias: 'widget.teamchart',
	    xtype: 'basic-line',


	    initComponent: function() {
	        var me = this;

	        this.myDataStore = Ext.create('Ext.data.JsonStore', {
	            fields: ['month', 'data1' ],
	            data: [
	                { month: 'Jan', data1: 20 },
	                { month: 'Feb', data1: 20 },
	                { month: 'Mar', data1: 19 },
	                { month: 'Apr', data1: 18 },
	                { month: 'May', data1: 18 },
	                { month: 'Jun', data1: 17 },
	                { month: 'Jul', data1: 16 },
	                { month: 'Aug', data1: 16 },
	                { month: 'Sep', data1: 16 },
	                { month: 'Oct', data1: 16 },
	                { month: 'Nov', data1: 15 },
	                { month: 'Dec', data1: 15 }
	            ]
	        });


	        me.items = [{
	            xtype: 'chart',
	            height: 410,
	            width: 780,
	            padding: '10 0 0 0',
	            style: {
	                'background' : '#fff'
	            },
	            animate: true,
	            shadow: false,
	            store: this.myDataStore,
	            insetPadding: 40,
	            items: [{
	                type  : 'text',
	                text  : 'Line Charts - Basic Line',
	                font  : '22px Helvetica',
	                width : 100,
	                height: 30,
	                x : 40, //the sprite x position
	                y : 12  //the sprite y position
	            }, {
	                type: 'text',
	                text: 'Data: Browser Stats 2012',
	                font: '10px Helvetica',
	                x: 12,
	                y: 380
	            }, {
	                type: 'text',
	                text: 'Source: http://www.w3schools.com/',
	                font: '10px Helvetica',
	                x: 12,
	                y: 390
	            }],
	            axes: [{
	                type: 'numeric',
	                fields: 'data1',
	                position: 'left',
	                grid: true,
	                minimum: 0,
	                label: {
	                    renderer: function(v) { return v + '%'; }
	                }
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
	            }]
	        }];

	        this.callParent();
	    }
	});