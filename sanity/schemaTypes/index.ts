import { blogPost } from "./blogPost"
import { contentBlocks } from "./blocks"
import { project } from "./project"

export const schemaTypes = [project, blogPost, ...contentBlocks]
