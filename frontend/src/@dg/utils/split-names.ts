

export function getFirstName(name) {
    let firstName: string;
    if (name.indexOf(' ') >= 0) {
        firstName = name.substr(0, name.indexOf(' '));
    } else {
        firstName = name;
    }
    return firstName
}

export function getLastName(name) {
    let lastName: string;
    if (name.indexOf(' ') >= 0) {
        lastName = name.substr(name.indexOf(' ') + 1);
    } else {
        lastName = '';
    }
    return lastName
}
