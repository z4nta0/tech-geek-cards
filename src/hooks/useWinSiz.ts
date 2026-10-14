
// #region Imports

import { useEffect } from 'react'; /** This import is the standard React hook that enables side effects for components. */
import { useState  } from 'react'; /** This import is the standard React hook that enables state management in functional components. */

// #endregion Imports



// #region Function Type Definitions

/** Use Window Size = This custom type stores the type that will be used for the custom {@link useWinSiz} function. */
type UseWinSiz      =  () => WinSizObj;



/**
 * Window Size Object = This custom type stores the types that will be used for the custom {@link winSizObj} state variable and is exported for use in any component that said variable is required.
 * 
 * @property winHeiNum = Window Height Number custom property stores the type that will be used for the custom {@link winSizObj.winHeiNum} property.
 * @property winWidNum = Window Width Number custom property stores the type that will be used for the custom {@link winSizObj.winWidNum} property.
 *
*/

export type WinSizObj = {

    winHeiNum : number;
    winWidNum : number;

};


// #endregion Function Type Definitions



// #region useWinSiz

/**
 * useWinSiz = Use Window Size
 *
 * @summary
 * This custom React hook executes the logic that is intended to provide the
 * current window viewport dimensions (height and width), and to update these
 * values whenever the window is resized. It utilizes the standard React
 * {@link useState} hook to manage the state of the window dimensions and the
 * standard React {@link useEffect} hook to set up an event listener for window
 * resize events.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 * 
 * @param void - This function takes no parameters.
 * 
 * @returns The winSizObj state object containing the current window height and width numbers in pixels.
 * @see {@link winSizObj}
 * 
 * @example
 * ```ts
 * useWinSiz() // => winSizObj;
 * ```
 *
*/

const useWinSiz : UseWinSiz = () => {


    // #region Function Scoped Variables


    // #region State Variables


    // #region iniStaObj

    /** Initial State Object = This custom type stores the custom {@link WinSizObj} type. I mirrored this type here because I wanted to make it clear in the declared types below that this object represents the initial state for the custom {@link winSizObj} state variable. */
    type IniStaObj           = WinSizObj;


    /**
     * Initial Size Object = This custom object stores the properties that are provided to the standard React {@link useState} function and are used to trigger rerenders when their values change. These values are commonly added to a component's standard React {@link useEffect} hook dependency array in order to re-run specific code on window resize events.
     * 
     * @property winHeiNum = Window Height Number custom property stores the current height number of the browser window viewport value, in pixels.
     * @property winWidNum = Window Width Number custom property stores the current width number of the browser window viewport value, in pixels.
     *
    */

    const iniStaObj : IniStaObj = {

        winHeiNum : window.innerHeight,
        winWidNum : window.innerWidth,

    };

    // #endregion iniStaObj



    /** Set Window Size Obj       = This custom type stores the type that will be used for the custom {@link setWinSizObj} state setter function. */
    type SetWinSizObj             = React.Dispatch< React.SetStateAction< IniStaObj > >;
    /** Use State Function Return = This custom type stores the types that will be returned from the standard React {@link useState} hook. */
    type UseStaFunRet             = [ WinSizObj, SetWinSizObj ];



    // #region State Initialization

    /** Window Size Object                           = This custom object stores the custom state variable that mirrors the custom {@link iniStaObj} object and is returned by the standard React {@link useState} hook. */
    /** Set Window Size Object                       = This custom variable stores the custom state setter function returned by the standard React {@link useState} hook, and it is used inside of the standard React {@link useEffect} hook to execute updates to the custom {@link winSizObj} state variable whenever the window is resized. */
    const [ winSizObj, setWinSizObj ] : UseStaFunRet = useState< WinSizObj >( iniStaObj );

    // #endregion State Initialization


    // #endregion State Variables


    // #endregion Function Scoped Variables



    // #region useEffect

    /**
     * useEffect Hook
     *
     * @summary
     * This standard React hook executes side effects for functional
     * components, such as data fetching, subscriptions, or manual DOM
     * manipulation. It serves to synchronize a component with external
     * systems. The custom inner code blocks inside will set up the custom
     * {@link handleResizeWinFun} function that will update the custom
     * {@link winSizObj} state object whenever the window is resized. It will
     * then attach said function as an event listener to the window's resize
     * event. Finally, it will return a cleanup function that will remove the
     * event listener. The empty dependency array ensures this effect runs only
     * once when the component mounts.
     * 
     * @author React  <https://react.dev/reference/react/useEffect>
     * @author z4nta0 <https://github.com/z4nta0>
     *
     * @param void - This function takes no parameters.
     *
     * @returns A cleanup function that removes the event listener.
     *
     * @example
     * ```ts
     * This function is not called directly, but rather it is run on component
     * mount and on changes to whatever variables are specified in the
     * dependency array.
     * ```
     *
    */

    useEffect( () => {


        // #region handleResizeWinFun


        // #region Function Type Declarations

        /** Handle Resize Window Function = This custom type stores type of the custom {@link handleResizeWinFun} function. */
        type HandleResizeWinFun           = () => void;

        // #endregion Function Type Declarations



        /**
         * handleResizeWinFun = Handle Resize Window Function
         * @see {@link HandleResizeWinFun}
         *
         * @summary
         * This custom function executes the logic that will update the custom
         * {@link winSizObj} state object by calling the custom
         * {@link setWinSizObj} state setter function whenever the window is
         * resized. It retrieves the current window inner height and width
         * values from the standard JS Window object and sets those values
         * accordingly.
         *
         * @author z4nta0 <https://github.com/z4nta0>
         *
         * @param void - This function takes no parameters.
         *
         * @returns This function does not return anything.
         *
         * @example
         * ```ts
         * handleResizeWinFun() // => void
         * ```
         *
        */

        const handleResizeWinFun : HandleResizeWinFun = () => {


            /** Set Window Size Object = This custom state setter function executes the updates to the custom {@link winSizObj} state object. */
            setWinSizObj({

                winHeiNum : window.innerHeight, /** Window Height Number = This custom property stores the custom state object's window height number equal to the standard JS Window object's inner height value. */
                winWidNum : window.innerWidth,  /** Window Width Number  = This custom property stores the custom state object's window width number equal to the standard JS Window object's inner width value. */

            });


        };

        // #endregion handleResizeWinFun



        /** Window Add Event Listener = This standard JS Window object method executes the attachment of the custom handle resize window function as an event listener to the standard JS Window object's resize event, so that the custom {@link winSizObj} state object can be updated whenever the window is resized. */
        window.addEventListener( 'resize', handleResizeWinFun );



        // #region Return Statement

        /** Anonymous Function = This custom function executes the removal of the previously set custom handle resize window function as an event listener on the standard JS Window object's resize event, when the component unmounts in order to prevent memory leaks. */
        return () : void => {


            /** Window Remove Event Listener = This standard JS Window object method executes the removal of the custom handle resize window function as an event listener from the standard JS Window object's resize event, when the component unmounts in order to prevent memory leaks. */
            window.removeEventListener( 'resize', handleResizeWinFun );


        };

        // #endregion Return Statement


    }, [] ); /** Empty Aray = This custom dependency array stores the values that define when useGSAP should be run, with an empty dependency array ensuring that this hook will run only once when the component mounts. */

    // #endregion useEffect



    // #region Return Statement

    return winSizObj;

    // #endregion Return Statement


};

// #endregion useWinSiz



export default useWinSiz;


