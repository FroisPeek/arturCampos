export const check = (dispatchTo: string) => {
    const a = document.createElement('a');
    if (!localStorage.getItem("tokens")) {
        const styles = localStorage.getItem("styles");
        localStorage.clear();
        if (styles) {
            localStorage.setItem("styles", styles);
        }

        a.href = "/login";
    } else if (dispatchTo) {
        a.href = dispatchTo
    }

    a.dispatchEvent(new MouseEvent('click'));
}