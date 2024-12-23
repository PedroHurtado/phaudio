export function globalHandler(context) {

    const unhandledrejection = (event) => {
        event.preventDefault();
        throw event.reason;
    };

    const errorEvent = (event) => {
        event.preventDefault();
        console.log(event.error.message);
    };

    context.addEventListener('error', errorEvent);
    context.addEventListener('unhandledrejection', unhandledrejection);

    return () => {
        context.removeEventListener('error', errorEvent);
        context.removeEventListener('unhandledrejection', unhandledrejection);
    }
}