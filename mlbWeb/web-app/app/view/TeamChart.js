Ext.define('MlbApp.view.TeamChart', {
	    extend: 'Ext.Panel',
	    alias: 'widget.teamchart',
	    xtype: 'basic-line',

	    initComponent: function() {
	        var me = this;

	        this.myDataStore = Ext.create('Ext.data.JsonStore', {
	            fields: ['month', 'data1', 'data2'],
	            data: [
	                { month: 'Jan', data1: 20, data2: 19 },
	                { month: 'Feb', data1: 20, data2: 18 },
	                { month: 'Mar', data1: 19, data2: 16 },
	                { month: 'Apr', data1: 18, data2: 14 },
	                { month: 'May', data1: 18, data2: 15 }
	            ]
	        });


	        me.items = [{
	            xtype: 'chart',
	            legend: {
	                position: 'right'
	            },
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
	                fields: ['data1','data2'],
	                position: 'left',
	                grid: true,
	                minimum: 0,
	                label: {
	                    renderer: function(v) { return v + '%'; }
	                },
	                title: 'Test Title'
	            }, {
	                type: 'category',
	                fields: 'month',
	                position: 'bottom',
	                grid: true,
	                label: {
	                    rotate: {
	                        degrees: -45
	                    }
	                },
	                title: 'Bottom Axis Title'
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
	        }];

	        this.callParent();
	    }
	});