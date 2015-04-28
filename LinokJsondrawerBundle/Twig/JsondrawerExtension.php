<?php
namespace Linok\JsondrawerBundle\Twig;

/**
 * Description of JsondrawerExtension
 *
 * @author Antoine Ribola <antoine.ribola@gmail.com>
 */
class JsondrawerExtension extends \Twig_Extension 
{
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('drawjson', array($this, 'drawjsonFilter')),
        );
    }

    public function drawjsonFilter($jsonstring)
    {
        $res = '<div id="svgBox"></div>';
        $res += '<script type="text/javascript" src="{{ asset(\'bundles/linokjsondrawer/js/lib/require.js\') }}"></script>\n';
        $res += '<script type="text/javascript" src="{{ asset(\'bundles/linokjsondrawer/js/drawer/drawer.js\') }}"></script>\n';
        $res += '<script type="text/javascript" >'
            . 'var drawer = new Drawer();'
            . 'drawer.setData('.$jsonstring.');'
            . '</script>';
        
        return $res;
    }

    public function getName()
    {
        return 'jsondrawer_extension';
    }
}
