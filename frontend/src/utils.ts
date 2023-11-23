export const parseArray = (v: string) => {
    try {
        return v.split(",");
    } catch (error) {
        return v;
    }
};

export const formatArray = (v: any) => {
    return !v || typeof v == 'string' ? v : v.join(",");
};

/*
const parseJson = (v: string) => {
    try {
        return JSON.parse(v);
    } catch (error) {
        return v;
    }
};

const formatJson = (v: any) => {
    return typeof v == 'string' ? v : JSON.stringify(v);
};
*/