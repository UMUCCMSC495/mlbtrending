Ext.define('MlbApp.common.Globals',{
	
	singleton: true,
	shortDateFormat : 'Y-m-d H:i T',
	root : window.location.href,
	
	/**
	 * In addition to setting configuration locally, this
	 * will call a server-side controller and receive a
	 * predefined value in JSON and stick it to the global
	 * props file. This will allow client-side debugging and 
	 * the presence of the value will determine if server-side 
	 * comms are happening properly.
	 */
	appInit: function(callback)
	{
        if(callback) {
            callback();
        }
	}
});