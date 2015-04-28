<?php

namespace Linok\JsondrawerBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Linok\JsondrawerBundle\DependencyInjection\LinokJsondrawerExtension;

class LinokJsondrawerBundle extends Bundle
{
    public function __construct()
    {
        $this->extension = new LinokJsondrawerExtension();
    }
}
