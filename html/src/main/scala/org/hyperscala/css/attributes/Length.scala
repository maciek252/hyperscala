package org.hyperscala.css.attributes

import org.powerscala.{Enumerated, EnumEntry}
import org.hyperscala.persistence.EnumEntryPersistence
import org.hyperscala.AttributeValue

/**
 * @author Matt Hicks <mhicks@hyperscala.org>
 */
class Length(val value: String) extends EnumEntry[Length] with AttributeValue

object Length extends Enumerated[Length] with EnumEntryPersistence[Length] {
  val Auto = new Length("auto")
  val Inherit = new Length("inherit")
  def Pixels(v: Int) = Length("%spx".format(v))
  def Centimeters(v: Int) = Length("%scm".format(v))
  def Percent(v: Int) = Length("%s%".format(v))

  override def apply(name: String) = super.apply(name) match {
    case null => new Length("%s".format(name))
    case v => v
  }
}