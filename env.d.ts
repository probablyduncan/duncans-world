declare module 'js-levenshtein' {
    /**
     * Takes two strings, and returns the difference between them.
     * Equal strings returns 0.
     * "Hey" and "Hay" returns 1.
     * "Hi" and "Hiya" returns 2.
     * If no common letters, returns the max of the two strings' lengths. 
     */
    export default function levenshtein(s1: string, s2: string): number;
}