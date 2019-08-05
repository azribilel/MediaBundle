<?php

namespace Lch\MediaBundle\Twig;

use Lch\MediaBundle\Entity\Image;
use Lch\MediaBundle\Entity\Media;
use Lch\MediaBundle\Manager\MediaManager;
use Symfony\Component\HttpFoundation\File\File;

class MediaExtension extends \Twig_Extension
{

    /**
     * @return array
     */
    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('get_thumbnail', [MediaRuntime::class, 'getThumbnail' ], [
                'needs_environment' => false,
                'is_safe' => ['html']
            ]),
            new \Twig_SimpleFunction('get_thumbnail_url', [MediaRuntime::class, 'getThumbnailUrl' ], [
                'needs_environment' => false,
            ]),
            new \Twig_SimpleFunction('get_list_item', [MediaRuntime::class, 'getListItem' ], [
                'needs_environment' => false,
                'is_safe' => ['html']
            ]),
            new \Twig_SimpleFunction('get_url', [MediaRuntime::class, 'getUrl' ], [
                'needs_environment' => false
            ]),
            new \Twig_SimpleFunction('get_real_url', [MediaRuntime::class, 'getRealUrl' ], [
                'needs_environment' => false
            ]),
            new \Twig_SimpleFunction('get_search_fields', [MediaRuntime::class, 'getSearchFields' ], [
                'needs_environment' => false,
                'is_safe' => ['html']
            ]),
            new \Twig_SimpleFunction('get_path', [MediaRuntime::class, 'getPath' ], [
                'needs_environment' => false,
                'is_safe' => ['html']
            ]),
        );
    }

    

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'lch.media_bundle.image';
    }
}