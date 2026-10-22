// Blog post kinds, in their own small module: the client-side blog list imports POST_KINDS from here,
// so it doesn't pull lib/blog.ts (and its CMS and Chinese-conversion code) into the browser bundle.
export type PostKind = 'story' | 'guest' | 'tips'
export const POST_KINDS: PostKind[] = ['story', 'guest', 'tips']
