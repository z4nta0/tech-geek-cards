import { useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './FathersDayCard.module.css';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/all';
import { GSDevTools } from "gsap/GSDevTools";
import { useEffect } from 'react';
import appreciateImg from '../assets/fathers-day-card/appreciate.webp';
import throughTheGenerationsImg from '../assets/fathers-day-card/through-the-generations.webp';
import everythingImg from '../assets/fathers-day-card/everything.webp';
import extra1Img from '../assets/fathers-day-card/extra-1.webp';
import extra2Img from '../assets/fathers-day-card/extra-2.webp';
import littleThingsImg from '../assets/fathers-day-card/little-things.webp';
import loveYouImg from '../assets/fathers-day-card/love-you.webp';
import importantRoleImg from '../assets/fathers-day-card/important-role.webp';
import needYouImg from '../assets/fathers-day-card/need-you.webp';
import specialDayImg from '../assets/fathers-day-card/special-day.webp';
import provideForUsImg from '../assets/fathers-day-card/provide-for-us.webp';
import thankYouImg from '../assets/fathers-day-card/thank-you.webp';
import useWinSiz from '../hooks/useWinSiz.ts';     /** This import is the custom React hook that will provide the current window viewport dimensions and will also be used to trigger the useEffect hook on window resize events, as well as altering certain animation settings based on how small or big its dimensions are. */
import { type WinSizObj } from '../hooks/useWinSiz.ts'; /** This import is the custom type definition for the custom state variable that is generated from the custom useWinSiz React Hook and stores the current viewport dimensions. */



gsap.registerPlugin(TextPlugin, SplitText, useGSAP, GSDevTools);

// ─── Component ────────────────────────────────────────────────────────────────

export default function FathersDayCard() {


    /** Window Height Number                   = This custom variable stores the current window viewport height and will trigger a rerender via the {@link useEffect} hook when the window is resized and its value changes in order to recalculate the snowfall and the pixelated transition animation parameters. */
    /** Window Width Number                    = This custom variable stores the current window viewport width and will trigger a rerender via the {@link useEffect} hook when the window is resized and its value changes in order to recalculate the snowfall and the pixelated transition animation parameters. */
    const { winHeiNum, winWidNum } : WinSizObj = useWinSiz();



    const [isLandscape, setIsLandscape] : [boolean|null, Function] = useState(true);



    const wakeLock = useRef(null) as React.MutableRefObject<WakeLockSentinel | null>;


    const gsaTimIns = useRef<GSAPTimeline>(null);



    const container = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;



   useGSAP(() => {
/*
life skills
riding a bike
teaching responsibility
work ethic
solving problems
safety net - car breaks down, etc...
pride and reassurance
dad jokes
sharing passions, hobbies, etc...
building or sharing traditions
role model - wife, family, community
emotional growth
*/

    const texArr = [
        ["To all of the fathers out there, ", "thank you", "!"],
        ["For ", "everything", " that you do for us."],
        ["Especially the ", "little things", "."],
        ["You play such an ", "important role", " in our lives."],
        ["What fathers ", "provide for us", " goes beyond words!"],
        ["And gets passed down ", "through the generations" ,"."],
        ["So on this ", "special day" ," we take great delight in celebrating you."],
        ["We do ", "love you", " always and unconditionally."],
        ["We do ", "appreciate", " all that you do."],
        ["And we will always ", "need you", " in our lives."],
        ["On behalf of the rest of us..."],
        ["Happy Father's Day!"],
    ];



    gsaTimIns.current = gsap.timeline().clear();



    const wrapper = document.getElementById('wrapper') as HTMLSpanElement;
    const typewriter1 = document.getElementById('typewriter1') as HTMLSpanElement;
    const typewriter2 = document.getElementById('typewriter2') as HTMLSpanElement;
    const typewriter3 = document.getElementById('typewriter3') as HTMLSpanElement;
    const cursor = document.getElementById('cursor') as HTMLSpanElement;
    const thankYouSVG = document.getElementById('thankYouSVG') as SVGAElement | HTMLElement;
    const heartPath = document.getElementById('heartPath') as SVGSVGElement | HTMLElement;
    const thankYou = document.getElementById('thankYouImg') as HTMLImageElement;
    const everythingYouDo = document.getElementById('everythingYouDoImg') as HTMLImageElement;
    const littleThings = document.getElementById('littleThingsImg') as HTMLImageElement;
    const ourWorld = document.getElementById('ourWorldImg') as HTMLImageElement;
    const mothersLove = document.getElementById('mothersLoveImg') as HTMLImageElement;
    const celebration = document.getElementById('celebrationImg') as HTMLImageElement;
    const ourResponsibility = document.getElementById('ourResponsibilityImg') as HTMLImageElement;
    const loveYou = document.getElementById('loveYouImg') as HTMLImageElement;
    const appreciateYou = document.getElementById('appreciateYouImg') as HTMLImageElement;
    const needYou = document.getElementById('needYouImg') as HTMLImageElement;
    const masonryGrid = document.getElementById('masonryGrid') as HTMLElement;

    const imgScale = screen.orientation.type.includes('landscape') ? 5 : 65;

    document.documentElement.style.setProperty('--scale-x', '0');




    gsaTimIns.current.set(wrapper, { height: '100%', scale: 1, opacity: 1, visibility: 'visible' });
    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(cursor, { opacity: 1 });

    gsaTimIns.current.set(thankYouSVG, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(thankYou, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(everythingYouDo, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(littleThings, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(ourWorld, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(mothersLove, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(celebration, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(ourResponsibility, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(loveYou, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(appreciateYou, { visibility: 'hidden', opacity: 0 });
    gsaTimIns.current.set(needYou, { visibility: 'hidden', opacity: 0 });

    gsaTimIns.current.set(masonryGrid, { visibility: 'hidden', opacity: 0 });



    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[0][0], delimiter: '' },
        duration: (texArr[0][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[0][1], delimiter: '' },
        duration: (texArr[0][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[0][2], delimiter: '' },
        duration: (texArr[0][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(':root', {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            thankYou.style.visibility = 'inherit';
            thankYou.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            thankYou.style.visibility = 'hidden';
            thankYou.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });


    //gsaTimIns.pause('test');

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });


    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[1][0], delimiter: '' },
        duration: (texArr[1][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[1][1], delimiter: '' },
        duration: (texArr[1][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[1][2], delimiter: '' },
        duration: (texArr[1][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            everythingYouDo.style.visibility = 'inherit';
            everythingYouDo.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            everythingYouDo.style.visibility = 'hidden';
            everythingYouDo.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[2][0], delimiter: '' },
        duration: (texArr[2][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[2][1], delimiter: '' },
        duration: (texArr[2][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[2][2], delimiter: '' },
        duration: (texArr[2][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            littleThings.style.visibility = 'inherit';
            littleThings.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            littleThings.style.visibility = 'hidden';
            littleThings.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[3][0], delimiter: '' },
        duration: (texArr[3][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[3][1], delimiter: '' },
        duration: (texArr[3][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[3][2], delimiter: '' },
        duration: (texArr[3][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            ourWorld.style.visibility = 'inherit';
            ourWorld.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            ourWorld.style.visibility = 'hidden';
            ourWorld.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[4][0], delimiter: '' },
        duration: (texArr[4][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[4][1], delimiter: '' },
        duration: (texArr[4][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[4][2], delimiter: '' },
        duration: (texArr[4][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            mothersLove.style.visibility = 'inherit';
            mothersLove.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            mothersLove.style.visibility = 'hidden';
            mothersLove.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[5][0], delimiter: '' },
        duration: (texArr[5][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[5][1], delimiter: '' },
        duration: (texArr[5][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[5][2], delimiter: '' },
        duration: (texArr[5][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            celebration.style.visibility = 'inherit';
            celebration.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            celebration.style.visibility = 'hidden';
            celebration.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[6][0], delimiter: '' },
        duration: (texArr[6][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[6][1], delimiter: '' },
        duration: (texArr[6][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[6][2], delimiter: '' },
        duration: (texArr[6][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            ourResponsibility.style.visibility = 'inherit';
            ourResponsibility.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            ourResponsibility.style.visibility = 'hidden';
            ourResponsibility.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[7][0], delimiter: '' },
        duration: (texArr[7][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[7][1], delimiter: '' },
        duration: (texArr[7][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[7][2], delimiter: '' },
        duration: (texArr[7][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            loveYou.style.visibility = 'inherit';
            loveYou.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            loveYou.style.visibility = 'hidden';
            loveYou.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[8][0], delimiter: '' },
        duration: (texArr[8][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[8][1], delimiter: '' },
        duration: (texArr[8][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[8][2], delimiter: '' },
        duration: (texArr[8][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.play('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            appreciateYou.style.visibility = 'inherit';
            appreciateYou.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            appreciateYou.style.visibility = 'hidden';
            appreciateYou.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[9][0], delimiter: '' },
        duration: (texArr[9][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter2, {
        text : { value: texArr[9][1], delimiter: '' },
        duration: (texArr[9][1].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    gsaTimIns.current.to(typewriter3, {
        text : { value: texArr[9][2], delimiter: '' },
        duration: (texArr[9][2].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

     gsaTimIns.current.to(typewriter2, {
        '--scale-x': 1,
        duration: 0.3,
        //slow then speeds up easing
        ease :  'power1.inOut',
    });

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(wrapper, {
        delay: 1.5,
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.remove('cursor-blink');

            document.documentElement.style.setProperty('--scale-x', '0');

        },
    });

    gsaTimIns.current.to(thankYouSVG, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            needYou.style.visibility = 'inherit';
            needYou.style.opacity = '1';

        },
    }, '<');

    //gsaTimIns.play('test');

    gsaTimIns.current.to(heartPath, {
        scale: imgScale,
        transformOrigin: '50% 50%',
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        
    }, '>');

    //gsaTimIns.pause('test');

    gsaTimIns.current.to(heartPath, {
        //autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1.5,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            needYou.style.visibility = 'hidden';
            needYou.style.opacity = '0';

            thankYouSVG.style.visibility = 'hidden';
            thankYouSVG.style.opacity = '0';

        },
    });

    gsaTimIns.current.set(typewriter1, { text: '' });
    gsaTimIns.current.set(typewriter2, { text: '' });
    gsaTimIns.current.set(typewriter3, { text: '' });
    gsaTimIns.current.set(wrapper, { scale: 1 });
    gsaTimIns.current.set(typewriter2, { clearProps: "--scale-x" });

    //gsaTimIns.play('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.add('cursor-blink'),
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[10][0], delimiter: '' },
        duration: (texArr[10][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
        repeat: 1,
        yoyo: true,
        yoyoEase: 'none',
        repeatDelay: 1.5,
    });

    //gsaTimIns.play('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.remove('cursor-blink'),
    });

    gsaTimIns.current.set(typewriter1, { text: '' });

    //gsaTimIns.current.play('test');

    gsaTimIns.current.to(wrapper, {
        opacity: 1,
        duration: 1, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {

            cursor.classList.add('cursor-blink');

            typewriter1.style.display = 'inline-block';
            typewriter1.style.padding = '0 29px';

        },
    });

    gsaTimIns.current.to(typewriter1, {
        text : { value: texArr[11][0], delimiter: '' },
        duration: (texArr[11][0].length * 1) / 15,
        //slow then speeds up easing
        ease :  'none',
    });

    //gsaTimIns.current.play('test');

    gsaTimIns.current.to(cursor, {
        opacity: 0,
        duration: 1,
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => cursor.classList.remove('cursor-blink'),
    });



    const scale = winWidNum <= 1300 && winWidNum > 900 ? 1.8 : winWidNum <= 900 && winWidNum > 700 ? 1.4 : winWidNum <= 700 ? 1.1 : 2;

    gsaTimIns.current.to(typewriter1, {
        scale: scale,
        transformOrigin: '50% 50%',
        duration: 1,
        //slow then speeds up easing
        ease :  'back',
    });

    gsaTimIns.current.set(".images", { clipPath: "inset(0 100% 0 0)" });

    gsaTimIns.current.to(masonryGrid, {
        autoAlpha: 1,
        duration: 0.1,
        //slow then speeds up easing
        ease: 'power1.in',
    }, '<');

    gsaTimIns.current.to(".images", {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.5,
        ease: "power2.out",
        stagger: {
            each: 0.1,
            from: "random",
            ease: "power2.inOut"
        }
    });

    gsaTimIns.current.to(wrapper, {
        height: 0, 
        //slow then speeds up easing
        ease: 'power1.in',
        onComplete: () => {
            alert('You may click on any of the images to expand them.');
            releaseWakeLock();
        },
    }, '>');

    //gsaTimIns.play('test');

    //GSDevTools.create();


   }, []);










    const releaseWakeLock = () => {
        if (wakeLock.current !== null) {
            wakeLock.current.release();
            wakeLock.current = null;
            //console.log('Screen Wake Lock released');
        }
    };




    const requestWakeLock = async () => {
        try {
            // Request a screen wake lock
            wakeLock.current = await navigator.wakeLock.request('screen');
            //console.log('Screen Wake Lock is active');
        } catch (err : any | unknown)
         {
            // The request can fail if the device is in low-power mode
            console.error(`${err.name}, ${err.message}`);
        }
    };



    useEffect(function setWakeLock () {
        requestWakeLock();
    }, []);



    useEffect(() => {

        const orientationType = screen.orientation.type;



        if (orientationType.includes('portrait')) {

            setIsLandscape(false);

        }

        else {

            setIsLandscape(true);

        }


    }, [winHeiNum, winWidNum]);



    useEffect(() => {

        const orientationType = screen.orientation.type;



        if (orientationType.includes('portrait')) {

            alert('For the best experience, please view this card in landscape mode by rotating your device.');



            setIsLandscape(false);



            if (gsaTimIns.current !== undefined && gsaTimIns.current !== null) {

                gsaTimIns.current.invalidate().restart();
                //gsaTimIns.current.seek("test");

            }

        }

        else {


            setIsLandscape(true);



            if (gsaTimIns.current !== undefined && gsaTimIns.current !== null) {

                gsaTimIns.current.invalidate().restart();
                //gsaTimIns.current.seek("test");

            }

        }


    }, []);



    const handleOnClick = (evt : React.MouseEvent<HTMLImageElement>) => {

        const target = evt.target as HTMLImageElement;
        const wrapper = document.getElementById('wrapper') as HTMLSpanElement;

        if (target.style.position === 'fixed') {

            wrapper.style.zIndex = '99';

            target.style.position = 'relative';
            target.style.left = 'initial';
            target.style.top = 'initial';
            target.style.width = '100%';
            target.style.height = '100%';
            target.style.objectFit = 'cover';
            target.style.objectPosition = 'initial';
            target.style.zIndex = 'initial';



            return;

        }

        else {

            wrapper.style.zIndex = '-1';

            target.style.position = 'fixed';
            target.style.left = '0';
            target.style.top = '0';
            target.style.width = '100vw';
            target.style.height = '100vh';
            target.style.objectFit = 'cover';
            target.style.objectPosition = 'center';
            target.style.zIndex = '9999999999999';



            return;

        }

    }

  // ── Render ───────────────────────────────────────────────────────────────

  return (


    <>


      <div ref={ container } id='maiConDiv' className={` ${ styles.mainContainerDiv } ${ styles.enterFullscreen }` } >

        

        <div id='wrapper' className={ styles.wrapper }>

            <p><span id="typewriter1" className={ `${ styles.typewriter }  typewriter` }></span><span id="typewriter2" className={ `${ styles.typewriter }  typewriter` }></span><span id="typewriter3" className={ `${ styles.typewriter }  typewriter` }></span><span id='cursor' className={ `${ styles.cursor }   cursor-blink` }>|</span></p>


        </div>



        <div className={ styles.videoContainer }>


            <svg id='thankYouSVG' className={ styles.thankYouSVG } style={{ visibility: 'hidden', opacity: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox={ isLandscape === true ? "0 0 1920 1080" : "0 0 409 911" }>


                <defs>


                    <clipPath id="heartClip">


                        <path id="heartPath" className={ styles.heartPath } fillRule="evenodd" clipRule="evenodd"
                            d={ isLandscape === true
                                ? "M 862.896 270 C 845.516 270 825.881 271.831 807.096 278.226 C 693.938 315.183 657.57 436.031 689.543 535.636 L 689.684 536.061 L 689.825 536.456 C 707.459 585.977 735.855 630.937 772.785 667.891 L 772.98 668.086 L 773.205 668.311 C 825.856 718.791 883.181 762.822 945.238 801.02 L 959.828 810 L 974.503 801.19 C 1036.7 763.832 1095.13 718.596 1147.13 668.511 L 1147.3 668.371 L 1147.47 668.201 C 1184.71 631.157 1213.1 585.892 1230.48 536.341 L 1230.62 535.916 L 1230.76 535.496 C 1262.11 436.115 1225.92 315.129 1113.55 278.705 C 1095.15 272.593 1076.17 270 1057.61 270 C 1015.86 270 984.954 287.494 960.023 305.298 C 935.262 287.606 904.167 270 862.896 270 Z"
                                : "M 201.052 440.915 C 200.436 440.915 199.738 440.98 199.072 441.207 C 195.054 442.519 193.764 446.809 194.899 450.345 L 194.904 450.36 L 194.908 450.374 C 195.535 452.132 196.542 453.727 197.854 455.04 L 197.86 455.047 L 197.869 455.055 C 199.738 456.847 201.772 458.41 203.975 459.766 L 204.494 460.085 L 205.014 459.772 C 207.223 458.446 209.296 456.84 211.143 455.062 L 211.149 455.057 L 211.154 455.051 C 212.477 453.736 213.484 452.129 214.102 450.37 L 214.106 450.355 L 214.111 450.34 C 215.225 446.812 213.94 442.517 209.951 441.224 C 209.298 441.007 208.623 440.915 207.964 440.915 C 206.483 440.915 205.386 441.535 204.501 442.168 C 203.621 441.54 202.518 440.915 201.052 440.915 Z"
                            }
                        ></path>


                    </clipPath>


                </defs>



                <foreignObject width="100%" height="100%">


                    <div className={ styles.videoContainer }>


                        <img id='thankYouImg' src={ thankYouImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='everythingYouDoImg' src={ everythingImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='littleThingsImg' src={ littleThingsImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='ourWorldImg' src={ importantRoleImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='mothersLoveImg' src={ provideForUsImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='celebrationImg' src={ throughTheGenerationsImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='ourResponsibilityImg' src={ specialDayImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='loveYouImg' src={ loveYouImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='appreciateYouImg' src={ appreciateImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />



                        <img id='needYouImg' src={ needYouImg } className={ styles.videos } style={ isLandscape === true ? { width: '1920px', height: '1080px', clipPath: 'url(#heartClip)' } : { width: '409px', height: '911px', clipPath: 'url(#heartClip)' } } />


                    </div>


                </foreignObject>


            </svg>



            {/*: <svg id='thankYouSVG' className={ styles.thankYouSVG } style={{ visibility: 'hidden', opacity: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 409 911">


            //     <defs>


            //         <clipPath id="heartClip">


            //             <path id="heartPath" className={ styles.heartPath } fillRule="evenodd" clipRule="evenodd" d="M 201.052 440.915 C 200.436 440.915 199.738 440.98 199.072 441.207 C 195.054 442.519 193.764 446.809 194.899 450.345 L 194.904 450.36 L 194.908 450.374 C 195.535 452.132 196.542 453.727 197.854 455.04 L 197.86 455.047 L 197.869 455.055 C 199.738 456.847 201.772 458.41 203.975 459.766 L 204.494 460.085 L 205.014 459.772 C 207.223 458.446 209.296 456.84 211.143 455.062 L 211.149 455.057 L 211.154 455.051 C 212.477 453.736 213.484 452.129 214.102 450.37 L 214.106 450.355 L 214.111 450.34 C 215.225 446.812 213.94 442.517 209.951 441.224 C 209.298 441.007 208.623 440.915 207.964 440.915 C 206.483 440.915 205.386 441.535 204.501 442.168 C 203.621 441.54 202.518 440.915 201.052 440.915 Z"></path>


            //         </clipPath>


            //     </defs>
  
            //     <foreignObject width="100%" height="100%">


            //         <div className={ styles.videoContainer }>


            //             <img id='thankYouImg' src={ thankYouImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='everythingYouDoImg' src={ everythingYouDoImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='littleThingsImg' src={ littleThingsImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='ourWorldImg' src={ ourWorldImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='mothersLoveImg' src={ mothersLoveImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='celebrationImg' src={ celebrationImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='ourResponsibilityImg' src={ ourResponsibilityImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='loveYouImg' src={ loveYouImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='appreciateYouImg' src={ appreciateYouImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />



            //             <img id='needYouImg' src={ needYouImg } className={ styles.videos } style={{ width: '409px', height: '911px', clipPath: 'url(#heartClip)' }} />


            //         </div>


            //     </foreignObject>

             </svg> */}


        </div>



        <div id="masonryGrid" className={ styles.grid }>


                    <div className={ `${ styles.cell}  ${ styles.c1r1 }` }>


                        <img id='imgOne' className={ `${ styles.c1r1Img }  ${styles.images }  images` } src={ specialDayImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c2r1 }` }>


                        <img id='imgTwo' className={ `${ styles.c2r1Img }  ${styles.images }  images` } src={ littleThingsImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c3r1 }` }>


                        <img id='imgThree' className={ `${ styles.c3r1Img }  ${styles.images }  images` } src={ needYouImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c4r1 }` }>


                        <img id='imgFour' className={ `${ styles.c4r1Img }  ${styles.images }  images` } src={ loveYouImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c1r2 }` }>


                        <img id='imgFive' className={ `${ styles.c1r2Img }  ${styles.images }  images` } src={ importantRoleImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c2r2 }` }>


                        <img id='imgSix' className={ `${ styles.c2r2Img }  ${styles.images }  images` } src={ extra2Img } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c3r2 }` }>


                        <img id='imgSeven' className={ `${ styles.c3r2Img }  ${styles.images }  images` } src={ extra1Img } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c4r2 }` }>


                        <img id='imgEight' className={ `${ styles.c4r2Img }  ${styles.images }  images` } src={ provideForUsImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c1r3 }` }>


                        <img id='imgNine' className={ `${ styles.c1r3Img }  ${styles.images }  images` } src={ throughTheGenerationsImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c2r3 }` }>


                        <img id='imgTen' className={ `${ styles.c2r3Img }  ${styles.images }  images` } src={ everythingImg } onClick={ handleOnClick } />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c3r3 }` }>


                        <img id='imgEleven' className={ `${ styles.c3r3Img }  ${styles.images }  images` } src={ thankYouImg } onClick={ handleOnClick } data-img-name="thankYouImg" />


                    </div>



                    <div className={ `${ styles.cell}  ${ styles.c4r3 }` }>


                        <img id='imgTwelve' className={ `${ styles.c4r3Img }  ${styles.images }  images` } src={ appreciateImg } onClick={ handleOnClick } />


                    </div>


      </div>




      </div>
    </>
  );
}


