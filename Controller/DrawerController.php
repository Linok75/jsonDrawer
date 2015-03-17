<?php

namespace Linok\JsonDrawerBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * class DrawerController
 * @Route("/drawer")
 */
class DrawerController extends Controller {
    
    /**
     * @Route("/drawingboard", name="linok_json_drawer_drawingboard")
     * @Method({"GET"})
     * @Template()
     */
    public function drawingboardAction (Request $request){
        return [];
    }
}
