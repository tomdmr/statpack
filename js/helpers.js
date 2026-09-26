/**
 * Helper functions for statpack.
 */

/**
 * Parse a date and optionally a date.
 * dateString is a date containing "dd.mm.yyyy", the optional timString must be "HH:MM"
 */
function parseDateTime(dateString, timeString=null){
    const [dd, mm, yyyy] = dateString.split('.');
    if(timeString){
        const [HH, MM] = timeString.split(':')
        return new Date(yyyy, mm-1, dd, HH, MM)
    }
    else
        return new Date(yyyy, mm-1, dd)
}
/**
 * Convenience function to remove all options from a select element
 */
function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

