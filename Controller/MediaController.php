<?php

namespace Lch\MediaBundle\Controller;

use Lch\MediaBundle\DependencyInjection\Configuration;
use Lch\MediaBundle\Entity\Media;
use Lch\MediaBundle\Event\PrePersistEvent;
use Lch\MediaBundle\LchMediaEvents;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class MediaController extends Controller // implements MediaControllerInterface
{

    public function listAction(Request $request, $type = Media::ALL) {

        $registeredMediaTypes = $this->getParameter('lch.media.types');
        // TODO add events for listing filtering, pass types found to event

        $medias = $this->get('lch.media.manager')->getFilteredMedias($registeredMediaTypes);
//        $medias = $this->getDoctrine()->getRepository('')->findAll();

        // TODO add pagination, infinite scroll
        // Choose CKEditor template if params in query
        if($request->query->has("CKEditor")) {
            $template = '@LchMedia/Media/fragments/list.ckeditor.html.twig';
        } else {
            $template = '@LchMedia/Media/fragments/list.html.twig';
        }
        return $this->render($template, [
            'medias' => $medias
        ]);
    }

    /**
     * @param Request $request
     * @param $type string the media type to add
     */
    public function addAction(Request $request, $type)
    {
        if(!isset($this->getParameter('lch.media.types')[$type])) {
            // TODO throw exception type not defined
        }

        $mediaClass = $this->getParameter('lch.media.types')[$type][Configuration::ENTITY];
        $mediaReflection = new \ReflectionClass($mediaClass);
        
        /**
         * @var Media
         */
        $mediaEntity = $mediaReflection->newInstance();

        $mediaForm = $this->createForm(
            $this->getParameter('lch.media.types')[$type][Configuration::FORM],
            $mediaEntity,
            [ 'action' => $this->generateUrl('lch_media_add', ['type' => $type])]
        );

        $mediaForm->handleRequest($request);

        if ($mediaForm->isSubmitted() && $mediaForm->isValid()) {
            
            // Dispatch pre-persist event to allow different media types listener to correctly persist media
            $prePersistEvent = new PrePersistEvent($mediaEntity);
            $this->get('event_dispatcher')->dispatch(
                LchMediaEvents::PRE_PERSIST,
                $prePersistEvent
            );

            $em = $this->getDoctrine()->getManager();
            $em->persist($prePersistEvent->getMedia());
            $em->flush();

            return new JsonResponse(array_merge(['success'   => true], $prePersistEvent->getData()));
        }

        return $this->render('@LchMedia/Media/add.html.twig', [
            'mediaForm' => $mediaForm->createView(),
            ]
        );

//        $em = $this->getDoctrine()->getManager();


//        $entity = new Image();
//        $form = $this->createForm(ImageType::class, $entity, [
//            'action' => $this->generateUrl('lch_media_image_add'),
//        ]);
//
//        $form->handleRequest($request);
//
//        if ($form->isSubmitted() ) {
//            if ($form->isValid()) {
//
//                if (null !== $entity->getFile()) {
//
                    $fileName = $this->get('lch.media.manager')->upload($entity);
//                    $entity->setFile($fileName);
//                }
//
//                if (null === $entity->getId()) {
//                    $em->persist($entity);
//                }
//
//                $em->flush();
//
//                $response = new JsonResponse();
//                $response->setData(array(
//                    'id' => $entity->getId(),
//                    'name' => $entity->getName(),
//                    'url' => $entity->getFile(),
//                ));
//
//                return $response;
//            } else {
//                $response = new Response(
//                    'Content',
//                    Response::HTTP_BAD_REQUEST,
//                    array('content-type' => 'text/html')
//                );
//            }
//        }
//
//        return $this->render('@LchMedia/Image/add.html.twig', [
//            'form' => $form->createView(),
//        ],
//            (isset($response)) ? $response : null
//        );
    }

    public function editAction()
    {
        // TODO: Implement editAction() method.
    }

    public function removeAction()
    {
        // TODO: Implement removeAction() method.
    }

}
