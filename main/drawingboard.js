'use strict';

requirejs.config(
    {
        paths: {
            'jquery': 'lib/jquery',
            'data': 'main/jsonexample',
            'mapper': 'main/jsonmapper'
        }
    }
);

define('jquery-private', ['jquery'], function(jq)
{
    return jq.noConflict(true);
});

require(
    [
        'jquery-private',
        'data',
        'mapper'
    ],
    function($, json, Jsonmapper)
    {
        $(document).ready(function()
        {
            var mapper = new Jsonmapper(json);
        });
    }
);