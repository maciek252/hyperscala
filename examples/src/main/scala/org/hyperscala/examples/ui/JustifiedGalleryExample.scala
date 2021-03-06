package org.hyperscala.examples.ui

import org.hyperscala.examples.Example
import org.hyperscala.html._
import org.hyperscala.html.attributes._
import org.hyperscala.css.attributes._
import org.hyperscala.realtime.RealtimeEvent
import org.hyperscala.ui.JustifiedGallery
import org.hyperscala.web._
import org.powerscala.Color
import scala.language.implicitConversions

import scala.language.reflectiveCalls

/**
 * @author Matt Hicks <matt@outr.com>
 */
class JustifiedGalleryExample extends Example {
  this.require(JustifiedGallery)

  contents += new tag.P {
    contents += "Justified-Gallery provides a justified gallery of images. This is a wrapper around this project: "
    contents += new tag.A(href = "https://github.com/miromannino/Justified-Gallery", target = Target.Blank, content = "Justified-Gallery")
  }

  val myDiv = new tag.Div(id = "myDiv")
  contents += myDiv
  val gallery = JustifiedGallery(myDiv)
  gallery.rowHeight := 240
  gallery.sizeRangeSuffixes := JustifiedGallery.DefaultSizeRangeSuffixes.map(t => t._1 -> "")

  contents += new tag.Button(content = "Refresh Images") {
    clickEvent := RealtimeEvent()

    clickEvent.on {
      case evt => refresh()
    }
  }

  refresh()

  def refresh() = {
    myDiv.contents.clear()
    (0 until 40).foreach {
      case index => {
        val width = math.round(400 * math.random).toInt + 50
        val height = math.round(600 * math.random).toInt + 100
        val imageURL = s"http://lorempixel.com/$width/$height/"
        myDiv.contents += new tag.A(href = imageURL) {
          contents += new tag.Img(src = imageURL, alt = s"Image ${index + 1}")
          if (index == 0) {
            contents += new tag.Div(clazz = List("caption")) {
              contents += "This is a "
              contents += new tag.Span(content = "custom caption!") {
                style.color := Color.Red
              }
              contents += new tag.Span(content = "Nice!") {
                style.float := Float.Right
              }
            }
          }
        }
      }
    }
    gallery.refresh()
  }
}