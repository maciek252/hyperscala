package org.hyperscala.ui.widgets.visual.`type`

import org.powerscala.property.StandardProperty
import org.hyperscala.ui.widgets.visual.{Visualize, VisualDetails}

import org.powerscala.reflect._
import org.powerscala.property.event.PropertyChangingEvent
import org.powerscala.bus.Routing

/**
 * @author Matt Hicks <matt@outr.com>
 */
object CaseClassVisualType extends VisualType[AnyRef] {
  def valid(details: VisualDetails[_]) = details.clazz.isCase

  def create(property: StandardProperty[AnyRef], details: VisualDetails[AnyRef]) = {
    property.listeners.synchronous {
      case evt: PropertyChangingEvent if (evt.newValue == null) => {
        Routing.Response(details.clazz.create[Any](Map.empty))    // Keep null from ever being set
      }
    }
    if (property() == null) {
      property := details.clazz.create[Any](Map.empty).asInstanceOf[AnyRef]
    }
    Visualize(_labeled = false, _editing = true).clazz[AnyRef](bindProperty = property)(Manifest.classType[AnyRef](details.clazz)).build()
  }
}