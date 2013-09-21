package org.hyperscala.html.tag

import org.hyperscala._
import css.StyleSheet
import html.HTMLTag
import org.hyperscala.html.attributes._
import org.hyperscala.html.constraints._

/**
 * NOTE: This file has been generated. Do not modify directly!
 * @author Matt Hicks <mhicks@hyperscala.org>
 */
class Area extends Container[BodyChild] with BodyChild with HTMLTag {
  lazy val xmlLabel = "area"

  def this(name: String = null,
           accessKey: java.lang.Character = null,
           clazz: List[String] = null,
           contentEditable: ContentEditable = null,
           contextMenu: String = null,
           dir: Direction = null,
           draggable: Draggable = null,
           dropZone: DropZone = null,
           hidden: java.lang.Boolean = null,
           id: String = null,
           lang: String = null,
           role: String = null,
           spellCheck: java.lang.Boolean = null,
           style: StyleSheet = null,
           tabIndex: java.lang.Integer = null,
           titleText: String = null,
           alt: String = null,
           coords: String = null,
           href: String = null,
           hrefLang: String = null,
           media: String = null,
           mimeType: String = null,
           rel: String = null,
           shape: String = null,
           target: String = null,
           content: BodyChild = null) = {
    this()
    init(name, accessKey, clazz, contentEditable, contextMenu, dir, draggable, dropZone, hidden, id, lang, role, spellCheck, style, tabIndex, titleText)
    up(this.alt, alt)
    up(this.coords, coords)
    up(this.href, href)
    up(this.hrefLang, hrefLang)
    up(this.media, media)
    up(this.mimeType, mimeType)
    up(this.rel, rel)
    up(this.shape, shape)
    up(this.target, target)
    if (content != null) contents += content
  }

  lazy val alt = PropertyAttribute[String]("alt", null)
  lazy val coords = PropertyAttribute[String]("coords", null)
  lazy val href = PropertyAttribute[String]("href", null)
  lazy val hrefLang = PropertyAttribute[String]("hreflang", null)
  lazy val media = PropertyAttribute[String]("media", null)
  lazy val mimeType = PropertyAttribute[String]("type", null)
  lazy val rel = PropertyAttribute[String]("rel", null)
  lazy val shape = PropertyAttribute[String]("shape", null)
  lazy val target = PropertyAttribute[String]("target", null)
}