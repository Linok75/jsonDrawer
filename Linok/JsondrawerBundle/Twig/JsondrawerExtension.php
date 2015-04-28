<?php

namespace Linok\JsondrawerBundle\Twig;

/**
 * Description of JsondrawerExtension
 *
 * @author Antoine Ribola <antoine.ribola@gmail.com>
 */
class JsondrawerExtension extends \Twig_Extension {

    public function getFilters() {
        return array(
            new \Twig_SimpleFilter('drawjson', array($this, 'drawjsonFilter')),
        );
    }

    public function drawjsonFilter($json) {
        
        echo '<div id="svgBox"></div>';
        echo '<script type="text/javascript" >';
        echo "'use strict';
            requirejs.config(
            {
                paths: {
                    'jquery': '/bundles/linokjsondrawer/js/lib/jquery',
                    'drawer': '/bundles/linokjsondrawer/js/drawer/drawer'
                }
            });

            define('jquery-private', ['jquery'], function(jq)
            {
                return jq.noConflict(true);
            });

            require(
            [
                'jquery-private',
                'drawer'
            ],
            
            function($, Drawer)
            {
        
                $(document).ready(function()
                {";

        echo 'var drawer = new Drawer();';
        echo 'var json = ' . $json . ';';
        echo 'drawer.setData(json);';
        echo '});});</script>';
    }

    public function getName() {
        return 'jsondrawer_extension';
    }

}
